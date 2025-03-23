import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.startAllMicroservices();

  await app.listen(config.HTTP_PORT);
}
bootstrap();
