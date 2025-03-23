import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import config from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.HTTP_PORT);
}
bootstrap();
