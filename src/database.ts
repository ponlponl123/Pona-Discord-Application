import mariadb from 'mariadb';
import { prefix as consolePrefix } from './config/console';

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
  
  public constructor (public option: databaseOption) {
    this.createPool(option).then(conn => {
      this.pool = conn;
      console.log(consolePrefix.database + '🟢 Database connected successfully!');
    }).catch((e) => {
      console.log(consolePrefix.database + '🔴 Failed to connect to the database, now pona application will have nosql and store everything in memory.\n\tReason:', e);
      // Exit the process to prevent further issues
      console.log(consolePrefix.database + '🔴 Exiting the process now...');
      process.exit(1);
    })
  }

  public async createPool(option: databaseOption): Promise<mariadb.Pool> {
    return mariadb.createPool({
      host: option.host,
      port: option.port,
      user: option.user,
      password: option.password,
      database: option.database
    })
  }

  private async _createConnection(option: databaseOption): Promise<mariadb.Connection> {
    return (await mariadb.createConnection({
      host: option.host,
      port: option.port,
      user: option.user,
      password: option.password,
      database: option.database,
    }))
  }
}