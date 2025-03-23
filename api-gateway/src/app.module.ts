import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CallEventsModule } from './call-events/call-events.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    AuthModule,
    UsersModule,
    CallEventsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
