import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WriterService } from './writer.service';

@Controller('writer')
export class WriterController {
  constructor(private readonly writerService: WriterService) {}

  @MessagePattern('call_event')
  async handleAmiEvent(callEventRaw: string) {
    try {
      await this.writerService.writeDbCallEvent(JSON.parse(callEventRaw));
      console.log(`call event ${callEventRaw} wrote to db success}`);
    } catch (error) {
      console.error(`call event ${callEventRaw} wrote to db error: ${error}`);
    }
  }
}
