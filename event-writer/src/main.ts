import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.AMPQ_URL],
        queue: config.AMPQ_QUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();

  const httpApp = await NestFactory.create(AppModule);

  await httpApp.listen(config.HTTP_PORT);
}
bootstrap();
