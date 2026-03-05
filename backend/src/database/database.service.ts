import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  public db: ReturnType<typeof drizzle<typeof schema>>;

  onModuleInit() {
    const queryClient = postgres(process.env.DATABASE_URL!);
    this.db = drizzle(queryClient, { schema });
  }
}
