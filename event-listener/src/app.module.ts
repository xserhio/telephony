import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AmiModule } from './ami/ami.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './rabbit-mq/rabbit-mq.module';
import config from './config';

@Module({
  imports: [
    AmiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    RabbitMQModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
