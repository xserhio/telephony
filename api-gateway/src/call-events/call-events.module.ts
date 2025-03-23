import { Module } from '@nestjs/common';
import { CallEventsController } from './call-events.controller';
import { CallEventsService } from './call-events.service';
import { DbModule } from '../db/db.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DbModule, JwtModule],
  controllers: [CallEventsController],
  providers: [CallEventsService],
  exports: [CallEventsService],
})
export class CallEventsModule {}
