import { Inject, Injectable } from '@nestjs/common';
import AMI from 'yana';
import { RabbitMQService } from '../rabbit-mq/rabbit-mq.service';

@Injectable()
export class AmiService {
  constructor(
    @Inject('AMI_MANAGER') private readonly ami: AMI,
    @Inject(RabbitMQService) private readonly rabbitMQService: RabbitMQService,
  ) {
    this.ami.on('Up', (event) => this.eventHandler(event));
    this.ami.on('Ring', (event) => this.eventHandler(event));
    this.ami.on('Hangup', (event) => this.eventHandler(event));
  }

  eventHandler(event: any) {
    const callEvent = {
      callStatus: event.channelstatedesc,
      callTimestamp: event.timestamp,
      callerId: event.calleridnum,
      channel: event.channel,
    };

    this.rabbitMQService
      .send('call_event', JSON.stringify(callEvent))
      .subscribe({
        next: (response) => console.log('Message sent successfully:', response),
        error: (err) => console.error('Error sending message:', err),
      });
  }
}
