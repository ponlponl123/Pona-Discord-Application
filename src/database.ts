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
  public connection: mariadb.Connection | undefined;
  
  public constructor (public option: databaseOption) {
    this.createConnection(option).then(conn => {
      this.connection = conn;
      console.log(consolePrefix.database + '🟢 Database connected successfully!');
    }).catch((e) => {
      console.log(consolePrefix.database + '🔴 Failed to connect to the database, now pona application will have nosql and store everything in memory.\n\tReason:', e);
    })
  }

  private async createConnection(option: databaseOption): Promise<mariadb.Connection> {
    return (await mariadb.createConnection({
      host: option.host,
      port: option.port,
      user: option.user,
      password: option.password,
      database: option.database,
    }))
  }
}