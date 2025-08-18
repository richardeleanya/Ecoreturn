import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, urlencoded } from "express";
import * as Sentry from "@sentry/node";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import rateLimit from "express-rate-limit";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { existsSync, mkdirSync } from "fs";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Sentry
  const sentryDsn = configService.get("SENTRY_DSN");
  if (sentryDsn) {
    Sentry.init({ dsn: sentryDsn });
  }

  // Helmet
  app.use(helmet());

  // Express body size
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));

  // Cookie Parser
  app.use(cookieParser());

  // CORS
  const allowedOrigins = (configService.get("NEXT_ALLOWED_ORIGINS") || "http://localhost:3000").split(",");
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Rate Limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // Static /uploads for dev only
  const uploadsPath = join(process.cwd(), "uploads");
  if (process.env.NODE_ENV !== "production") {
    if (!existsSync(uploadsPath)) mkdirSync(uploadsPath);
    app.use("/uploads", app.getHttpAdapter().getInstance().static(uploadsPath));
  }

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Transform interceptor (standard response format)
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle("EcoReturn API")
    .setDescription("Enterprise-grade Circular Economy Rewards API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  await app.listen(configService.get("PORT") || 4000);
  // eslint-disable-next-line no-console
  console.log(`EcoReturn API listening at http://localhost:${configService.get("PORT") || 4000}`);
}

bootstrap();