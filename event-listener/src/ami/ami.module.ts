import { Module } from '@nestjs/common';
import { AmiService } from './ami.service';
import { getAmiManager } from './ami-manager';
import config from '../config';
import { RabbitMQModule } from '../rabbit-mq/rabbit-mq.module';

@Module({
  imports: [RabbitMQModule],
  providers: [
    AmiService,
    {
      provide: 'AMI_MANAGER',
      useFactory: async () => {
        const AMI = await getAmiManager();

        const ami = new AMI({
          login: config.AMI_USERNAME,
          host: config.AMI_HOST,
          password: config.AMI_PASSWORD,
          port: config.AMI_PORT,
          events: 'on',
        });

        await ami.connect(function () {
          console.log('Connected to AMI');
        });

        ami.on('error', function (err) {
          console.log('An error occured: ' + err);
        });

        return ami;
      },
    },
  ],
  exports: [AmiService],
})
export class AmiModule {}
