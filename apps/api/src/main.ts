import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // CORS Allowlist
  const corsAllowlist = (
    process.env.CORS_ALLOWLIST ||
    process.env.NEXT_ALLOWED_ORIGINS ||
    'http://localhost:3000,http://localhost:3001,http://localhost:3002'
  )
    .split(',')
    .map((url) => url.trim());
  app.enableCors({
    origin: corsAllowlist,
    credentials: true,
  });

  app.use(cookieParser());

  // Serve static /uploads in development
  if (process.env.NODE_ENV !== 'production') {
    app.use('/uploads', express.static('uploads'));
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Sentry (env-gated)
  if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.errorHandler());
  }

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('EcoReturn API')
    .setDescription('API documentation for EcoReturn platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
  // eslint-disable-next-line no-console
  console.log(`EcoReturn API running on: ${await app.getUrl()}`);
}
bootstrap();