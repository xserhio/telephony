import { Module } from '@nestjs/common';
import { WriterService } from './writer.service';
import { WriterController } from './writer.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [WriterService],
  controllers: [WriterController],
  exports: [WriterService],
})
export class WriterModule {}
