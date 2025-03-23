import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../constants';
import config from '../config';

const dbProvider = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: config.PG_USERNAME,
    host: config.PG_HOST,
    database: config.PG_DB,
    password: config.PG_PASSWORD,
    port: config.PG_PORT,
  }),
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
