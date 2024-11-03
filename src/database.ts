import mysql from 'mysql2/promise';
import { prefix as consolePrefix } from './config/console';

export interface databaseOption {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class Database {
  public connection: mysql.Connection | undefined;
  
  public constructor (public option: databaseOption) {
    this.createConnection(option).then(conn => {
      this.connection = conn;
      console.log(consolePrefix.database + 'Database connected successfully!');
    })
  }

  private async createConnection(option: databaseOption): Promise<mysql.Connection> {
    return (await mysql.createConnection({
      host: option.host,
      port: option.port,
      user: option.user,
      password: option.password,
      database: option.database,
    }))
  }
}