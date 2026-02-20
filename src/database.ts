import * as mariadb from 'mariadb';
import { prefix as consolePrefix, type as consoleType } from './config/console';

export interface databaseOption {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class Database {
  // public connection: mariadb.Connection | undefined;
  public pool: mariadb.Pool | undefined;

  public constructor(public option: databaseOption) {
    this.createPool(option)
      .then((conn) => {
        this.pool = conn;
        console.log(consoleType.info, consolePrefix.database + '🟢 Database connected successfully!');
      })
      .catch((e) => {
        console.log(
          consoleType.error,
          consolePrefix.database +
            '🔴 Failed to connect to the database, now pona application will have nosql and store everything in memory.\n\tReason:',
          e,
        );
        // Exit the process to prevent further issues
        console.log(consoleType.error, consolePrefix.database + '🔴 Exiting the process now...');
        process.exit(1);
      });
  }

  public async createPool(option: databaseOption): Promise<mariadb.Pool> {
    return mariadb.createPool({
      host: option.host,
      port: option.port,
      user: option.user,
      password: option.password,
      database: option.database,
      connectionLimit: 5, // Lower limit to avoid exhausting MariaDB max_connections
      acquireTimeout: 10000, // 10 seconds to acquire a connection
      idleTimeout: 60000, // Close idle connections after 60 seconds
      minimumIdle: 1, // Keep at least 1 connection ready
      resetAfterUse: true, // Reset connection state after use
    });
  }

  // private async _createConnection(
  //   option: databaseOption,
  // ): Promise<mariadb.Connection> {
  //   return await mariadb.createConnection({
  //     host: option.host,
  //     port: option.port,
  //     user: option.user,
  //     password: option.password,
  //     database: option.database,
  //   });
  // }

  public async query(sql: string, values?: any): Promise<any> {
    if (!this.pool) {
      throw new Error('Database pool is not initialized');
    }
    return this.pool.query(sql, values);
  }
}
