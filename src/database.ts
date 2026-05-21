import { prefix as consolePrefix, type as consoleType } from './config/console';
import { prisma } from './prisma';

export interface DatabaseOption {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class Database {
  private runningQueries = 0;
  private readonly maxConcurrentQueries = 12;
  private readonly waitingQueries: Array<() => void> = [];
  private _isConnected = false;
  private heartbeatInterval: any;

  public get pool(): any {
    return this._isConnected ? prisma : undefined;
  }

  constructor(public readonly option: DatabaseOption) {
    this.init();
  }

  private async init() {
    try {
      await prisma.$connect();
      this._isConnected = true;
      console.log(
        consoleType.info,
        consolePrefix.database + '🟢 Database connected successfully via Prisma!',
      );
      this.startHeartbeat();
    } catch (e) {
      this._isConnected = false;
      console.log(
        consoleType.error,
        consolePrefix.database +
          '🔴 Failed to connect to the database via Prisma.\n\tReason:',
        e,
      );
      console.log(
        consoleType.error,
        consolePrefix.database + '🔴 Exiting the process now...',
      );
      process.exit(1);
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(async () => {
      try {
        await prisma.$executeRaw`SELECT 1`;
        if (!this._isConnected) {
          this._isConnected = true;
          console.log(
            consoleType.info,
            consolePrefix.database + '🟢 Database connection restored.',
          );
        }
      } catch (e) {
        if (this._isConnected) {
          this._isConnected = false;
          console.warn(
            consoleType.warn,
            consolePrefix.database + '🟡 Database connection lost (Heartbeat failed).',
          );
        }
      }
    }, 30000);
  }

  public async query<T = any>(sql: string, values?: any[]): Promise<T[]> {
    return this.runWithQuerySlot(async () => {
      try {
        const result = values
          ? await prisma.$queryRawUnsafe<T[]>(sql, ...values)
          : await prisma.$queryRawUnsafe<T[]>(sql);
        this._isConnected = true;
        return result;
      } catch (e) {
        throw e;
      }
    });
  }

  /**
   * Run multiple queries in a transaction via Prisma.
   */
  public async queryBatch(
    queries: { sql: string; values?: any[] }[],
  ): Promise<any[]> {
    return this.runWithQuerySlot(async () => {
      return prisma.$transaction(
        queries.map((q) => {
          if (q.values) {
            return prisma.$executeRawUnsafe(q.sql, ...q.values);
          }
          return prisma.$executeRawUnsafe(q.sql);
        }),
      );
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
