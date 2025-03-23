import { Inject, Injectable } from '@nestjs/common';
import { CallEvent } from '../types';
import { PG_CONNECTION } from '../constants';
import { Client } from 'pg';
import { DateTime } from 'luxon';

@Injectable()
export class WriterService {
  constructor(@Inject(PG_CONNECTION) private conn: Client) {}

  async writeDbCallEvent(callEvent: CallEvent) {
    const timestampDate = DateTime.fromSeconds(
      parseFloat(callEvent.callTimestamp),
    ).toJSDate();

    return await this.conn.query(
      `INSERT INTO call_events (status, caller_id, timestamp, channel) VALUES ($1, $2, $3, $4)`,
      [
        callEvent.callStatus,
        callEvent.callerId,
        timestampDate,
        callEvent.channel,
      ],
    );
  }
}
