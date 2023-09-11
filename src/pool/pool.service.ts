import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class PoolService {
    pool: Pool;

    constructor() {
      this.pool = createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
    }
}