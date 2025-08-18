import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { rateLimit } from 'express-rate-limit';
import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });
  const configService = app.get(ConfigService);

  // Helmet for HTTP security
  app.use(helmet());

  // CORS
  const allowedOrigins = (configService.get<string>('CORS_ALLOWLIST') || '').split(',').filter(Boolean);
  app.enableCors({
    origin: allowedOrigins.length
      ? (origin, cb) =>
          !origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('CORS blocked'), false)
      : true,
    credentials: true,
  });

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Sentry (env-gated)
  const sentryDsn = configService.get<string>('SENTRY_DSN');
  if (sentryDsn) {
    Sentry.init({ dsn: sentryDsn, tracesSampleRate: 0.1 });
  }

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EcoReturn API')
    .setDescription('API docs for EcoReturn')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  Logger.log(`API running on http://localhost:${port}`);
  Logger.log(`Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();