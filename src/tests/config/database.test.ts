import { describe, it, expect } from 'bun:test';
import {
  formatDbUrl,
  buildMariaDbSsl,
  readCertFileOrContent,
} from '@/config/database';

describe('formatDbUrl', () => {
  it('omits password when password is empty or undefined (passwordless client-cert auth)', () => {
    const url = formatDbUrl({
      host: '127.0.0.1',
      port: 3306,
      user: 'mtls_user',
      password: '',
      database: 'pona_db',
    });
    expect(url).toBe('mysql://mtls_user@127.0.0.1:3306/pona_db');
  });

  it('includes encoded password when password is provided', () => {
    const url = formatDbUrl({
      host: 'localhost',
      port: 3306,
      user: 'admin',
      password: 'p@ss:word/123',
      database: 'prod_db',
    });
    expect(url).toBe('mysql://admin:p%40ss%3Aword%2F123@localhost:3306/prod_db');
  });

  it('appends sslmode=require and sslaccept=accept_invalid_certs when no CA is provided', () => {
    const url = formatDbUrl({
      host: 'localhost',
      port: 3306,
      user: 'dbuser',
      database: 'app',
      sslMode: 'require',
    });
    expect(url).toContain('sslmode=require');
    expect(url).toContain('sslaccept=accept_invalid_certs');
  });

  it('appends sslmode=require, sslcert, sslidentity, and sslaccept=strict when CA and client certs are provided', () => {
    const url = formatDbUrl({
      host: 'mariadb.internal',
      port: 3306,
      user: 'migrator',
      password: '',
      database: 'pona',
      sslMode: 'require',
      sslCa: '/etc/db-certs/ca.crt',
      sslCert: '/etc/db-certs/tls.crt',
      sslKey: '/etc/db-certs/tls.key',
    });
    expect(url).toContain('mysql://migrator@mariadb.internal:3306/pona?');
    expect(url).toContain('sslmode=require');
    expect(url).toContain('sslcert=%2Fetc%2Fdb-certs%2Fca.crt');
    expect(url).toContain('sslidentity=%2Fetc%2Fdb-certs%2Ftls.crt');
    expect(url).toContain('sslaccept=strict');
  });

  it('maps verify-identity and verify-ca to verify-identity with sslaccept=strict', () => {
    const url1 = formatDbUrl({
      host: 'localhost',
      port: 3306,
      user: 'root',
      database: 'test',
      sslMode: 'verify-identity',
    });
    expect(url1).toContain('sslmode=verify-identity');
    expect(url1).toContain('sslaccept=strict');

    const url2 = formatDbUrl({
      host: 'localhost',
      port: 3306,
      user: 'root',
      database: 'test',
      sslMode: 'verify-ca',
    });
    expect(url2).toContain('sslmode=verify-identity');
    expect(url2).toContain('sslaccept=strict');
  });

  it('automatically defaults to sslmode=require if certificates are passed without explicit sslMode', () => {
    const url = formatDbUrl({
      host: 'localhost',
      port: 3306,
      user: 'root',
      database: 'test',
      sslCert: '/certs/client.crt',
    });
    expect(url).toContain('sslmode=require');
    expect(url).toContain('sslidentity=%2Fcerts%2Fclient.crt');
  });
});

describe('buildMariaDbSsl', () => {
  it('returns undefined when no SSL parameters are configured', () => {
    expect(buildMariaDbSsl({})).toBeUndefined();
  });

  it('returns false when sslMode is disable / disabled / false', () => {
    expect(buildMariaDbSsl({ sslMode: 'disable' })).toBe(false);
    expect(buildMariaDbSsl({ sslMode: 'disabled' })).toBe(false);
    expect(buildMariaDbSsl({ sslMode: 'false' })).toBe(false);
  });

  it('returns ssl options object with rejectUnauthorized=false when mode is require without CA', () => {
    const ssl = buildMariaDbSsl({ sslMode: 'require' });
    expect(ssl).toEqual({ rejectUnauthorized: false });
  });

  it('returns ssl options with rejectUnauthorized=true when mode is verify-identity or CA is provided', () => {
    const ssl1 = buildMariaDbSsl({ sslMode: 'verify-identity' });
    expect(ssl1).toEqual({ rejectUnauthorized: true });

    const ssl2 = buildMariaDbSsl({ sslCa: 'raw-ca-content' });
    expect(ssl2).toEqual({ ca: 'raw-ca-content', rejectUnauthorized: true });
  });

  it('correctly maps ca, cert, and key content', () => {
    const ssl = buildMariaDbSsl({
      sslMode: 'require',
      sslCa: 'ca-content',
      sslCert: 'cert-content',
      sslKey: 'key-content',
      rejectUnauthorized: false,
    });
    expect(ssl).toEqual({
      ca: 'ca-content',
      cert: 'cert-content',
      key: 'key-content',
      rejectUnauthorized: false,
    });
  });
});

describe('readCertFileOrContent', () => {
  it('returns undefined for undefined input', () => {
    expect(readCertFileOrContent(undefined)).toBeUndefined();
  });

  it('returns raw string if not a file path', () => {
    const cert = '-----BEGIN CERTIFICATE-----\nMIIB...';
    expect(readCertFileOrContent(cert)).toBe(cert);
  });
});
