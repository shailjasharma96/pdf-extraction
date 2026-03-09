import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001";
  const origins = corsOrigin.includes(",") ? corsOrigin.split(",") : corsOrigin;

  console.log(`[CORS] Allowed Origins: ${origins}`);
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Backend running on port: ${port}`);
}
bootstrap();