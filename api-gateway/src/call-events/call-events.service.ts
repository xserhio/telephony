import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { Client } from 'pg';

@Injectable()
export class CallEventsService {
  constructor(@Inject(PG_CONNECTION) private db: Client) {}

  async getAll(username: string, startDate?: string, endDate?: string) {
    let query = `
            SELECT DISTINCT ce.id AS "event_id",
            ce.status AS "event_status",
            ce.caller_id AS "caller_id",
            ce.timestamp AS "event_timestamp",
            ce.channel AS "event_channel"
            FROM "call_events" ce
            JOIN "users" u ON ce.caller_id = u.phone
            WHERE u.username = $1`;

    const params: any[] = [username];

    if (startDate) {
      query += ` AND ce.timestamp >= $2`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND ce.timestamp <= $3`;
      params.push(endDate);
    }

    query += ` ORDER BY ce.timestamp DESC`;

    const result = await this.db.query(query, params);
    return result.rows;
  }
}
