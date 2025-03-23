import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { PG_CONNECTION } from '../constants';
import { RegisterDto } from '../auth/dto/registration-request.dto';
import { hashPassword } from '../lib/crypto';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private db: Client) {}

  async findOne(username: string) {
    return (
      await this.db.query(`SELECT * FROM users WHERE username=$1`, [username])
    ).rows[0];
  }

  async getUserAuthToken(username: string): Promise<{ token: string }[]> {
    return (
      await this.db.query(
        `SELECT at.token
                                    FROM auth_tokens at JOIN users u ON at.user_id = u.id
                                    WHERE u.username = $1;
        `,
        [username],
      )
    ).rows;
  }

  async saveAccessToken(username: string, token: string) {
    await this.db.query(
      `
                  WITH user_info AS (
                    SELECT id
                    FROM users
                    WHERE username = $1
                  )
                  INSERT INTO "auth_tokens" ("user_id", "token", "created_at")
                  SELECT id, $2, CURRENT_TIMESTAMP
                  FROM user_info;
      `,
      [username, token],
    );
  }

  async create(dto: RegisterDto) {
    dto.password = await hashPassword(dto.password);

    const { email, username, password, phone } = dto;

    await this.db.query(
      `INSERT INTO users (email, username, phone, password) VALUES ($1, $2, $3, $4)`,
      [email, username, phone, password],
    );
  }
}
