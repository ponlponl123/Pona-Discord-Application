import * as mariadb from 'mariadb';
import { prefix as consolePrefix, type as consoleType } from './config/console';

export interface DatabaseOption {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class Database {
  public pool: mariadb.Pool | undefined;
  private runningQueries = 0;
  private readonly maxConcurrentQueries = 12;
  private readonly waitingQueries: Array<() => void> = [];

  constructor(public readonly option: DatabaseOption) {
    this.createPool(option)
      .then((pool) => {
        this.pool = pool;
        console.log(
          consoleType.info,
          consolePrefix.database + '🟢 Database connected successfully!',
        );
      })
      .catch((e) => {
        console.log(
          consoleType.error,
          consolePrefix.database +
            '🔴 Failed to connect to the database.\n\tReason:',
          e,
        );
        console.log(
          consoleType.error,
          consolePrefix.database + '🔴 Exiting the process now...',
        );
        process.exit(1);
      });
  }

  public async createPool(option: DatabaseOption): Promise<mariadb.Pool> {
    return mariadb.createPool({
      host: option.host,
      port: option.port,
      user: option.user,
      password: option.password,
      database: option.database,
      connectionLimit: 20,
      acquireTimeout: 30000,
      idleTimeout: 60000,
      minimumIdle: 2,
      resetAfterUse: true,
    });
  }

  public async query(sql: string, values?: unknown[]): Promise<unknown> {
    if (!this.pool) throw new Error('Database pool is not initialized');
    return this.runWithQuerySlot(() => this.pool!.query(sql, values));
  }

  /**
   * Run multiple queries on a single pooled connection, then release it.
   * Use this when firing several sequential INSERTs to avoid consuming
   * multiple pool slots at the same time.
   */
  public async queryBatch(
    queries: { sql: string; values?: unknown[] }[],
  ): Promise<unknown[]> {
    if (!this.pool) throw new Error('Database pool is not initialized');
    return this.runWithQuerySlot(async () => {
      const conn = await this.pool!.getConnection();
      const results: unknown[] = [];
      try {
        for (const q of queries) {
          results.push(await conn.query(q.sql, q.values));
        }
      } finally {
        conn.release();
      }
      return results;
    });
  }

  private async runWithQuerySlot<T>(operation: () => Promise<T>): Promise<T> {
    await this.acquireQuerySlot();
    try {
      return await operation();
    } finally {
      this.releaseQuerySlot();
    }
  }

  private async acquireQuerySlot(): Promise<void> {
    if (this.runningQueries < this.maxConcurrentQueries) {
      this.runningQueries++;
      return;
    }

    await new Promise<void>((resolve) => {
      this.waitingQueries.push(() => {
        this.runningQueries++;
        resolve();
      });
    });
  }

  private releaseQuerySlot(): void {
    this.runningQueries = Math.max(0, this.runningQueries - 1);
    const next = this.waitingQueries.shift();
    if (next) next();
  }
}
