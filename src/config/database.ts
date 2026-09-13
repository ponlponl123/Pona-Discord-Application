import tls from "node:tls";
if (tls?.TLSSocket?.prototype?.getPeerCertificate) {
  const orig = tls.TLSSocket.prototype.getPeerCertificate;
  tls.TLSSocket.prototype.getPeerCertificate = function (detailed?: boolean) {
    const cert = orig.call(this, detailed);
    if (cert && typeof cert === "object" && !cert.fingerprint256) cert.fingerprint256 = "";
    return cert;
  };
}
import fs from 'node:fs';
import env, { argv } from './env';

export interface DatabaseConnectionOptions {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
  sslMode?: string;
  sslCa?: string;
  sslCert?: string;
  sslKey?: string;
  rejectUnauthorized?: boolean;
}

export function readCertFileOrContent(val?: string): string | undefined {
  if (!val) return undefined;
  if (fs.existsSync(val)) {
    try {
      return fs.readFileSync(val, 'utf8');
    } catch {
      return val;
    }
  }
  return val;
}

export function formatDbUrl(cfg: DatabaseConnectionOptions): string {
  const encodedUser = encodeURIComponent(cfg.user);
  const auth = cfg.password
    ? `${encodedUser}:${encodeURIComponent(cfg.password)}`
    : encodedUser;
  const base = `mysql://${auth}@${cfg.host}:${cfg.port}/${cfg.database}`;

  const params = new URLSearchParams();
  const rawMode = cfg.sslMode?.toLowerCase();

  if (rawMode) {
    const modeMap: Record<string, string> = {
      require: 'require',
      required: 'require',
      'verify-ca': 'verify-identity',
      'verify-identity': 'verify-identity',
      'verify-full': 'verify-identity',
      prefer: 'prefer',
      preferred: 'prefer',
      disable: 'disable',
      disabled: 'disable',
    };
    const mapped = modeMap[rawMode] || rawMode;
    params.set('sslmode', mapped);
    if (mapped === 'require' && !cfg.sslCa) {
      params.set('sslaccept', 'accept_invalid_certs');
    } else if (
      mapped === 'verify-identity' ||
      mapped === 'verify-ca' ||
      cfg.sslCa
    ) {
      params.set('sslaccept', 'strict');
    }
  } else if (cfg.sslCa || cfg.sslCert || cfg.sslKey) {
    params.set('sslmode', 'require');
    params.set('sslaccept', cfg.sslCa ? 'strict' : 'accept_invalid_certs');
  }

  if (cfg.sslCa) params.set('sslcert', cfg.sslCa);
  if (cfg.sslCert) params.set('sslidentity', cfg.sslCert);

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function buildMariaDbSsl(cfg: {
  sslMode?: string;
  sslCa?: string;
  sslCert?: string;
  sslKey?: string;
  rejectUnauthorized?: boolean;
}) {
  const mode = cfg.sslMode?.toLowerCase();
  if (mode === 'disable' || mode === 'disabled' || mode === 'false') {
    return false;
  }

  const hasCert = !!cfg.sslCa || !!cfg.sslCert || !!cfg.sslKey;
  const isModeActive =
    !!mode && mode !== 'disable' && mode !== 'disabled' && mode !== 'false';

  if (!hasCert && !isModeActive && cfg.rejectUnauthorized === undefined) {
    return undefined;
  }

  const ssl: {
    ca?: string;
    cert?: string;
    key?: string;
    rejectUnauthorized?: boolean;
  } = {};

  if (cfg.sslCa) ssl.ca = readCertFileOrContent(cfg.sslCa);
  if (cfg.sslCert) ssl.cert = readCertFileOrContent(cfg.sslCert);
  if (cfg.sslKey) ssl.key = readCertFileOrContent(cfg.sslKey);

  if (cfg.rejectUnauthorized !== undefined) {
    ssl.rejectUnauthorized = cfg.rejectUnauthorized;
  } else if (mode === 'require' && !cfg.sslCa) {
    ssl.rejectUnauthorized = false;
  } else if (
    mode === 'verify-ca' ||
    mode === 'verify-identity' ||
    mode === 'verify-full' ||
    !!cfg.sslCa
  ) {
    ssl.rejectUnauthorized = true;
  }

  return ssl;
}

function parseBool(val?: string): boolean | undefined {
  if (val === 'true' || val === '1') return true;
  if (val === 'false' || val === '0') return false;
  return undefined;
}

const isProduction =
  argv.includes('--production') ||
  argv.includes('-launch') ||
  env.NODE_ENV === 'production';

// Primary Database Configuration
const host = env.DB_HOST || env.DATABASE_HOST || 'localhost';
const port = Number(env.DB_PORT || env.DATABASE_PORT) || 3306;
const user = env.DB_USER || env.DATABASE_USER || 'me';
const sslMode = env.DB_SSL_MODE || undefined;
const sslCa = env.DB_SSL_CA || undefined;
const sslCert = env.DB_SSL_CC || undefined;
const sslKey = env.DB_SSL_CK || undefined;
const rejectUnauthorized = parseBool(env.DB_SSL_REJECT_UNAUTHORIZED);

const ssl = buildMariaDbSsl({
  sslMode,
  sslCa,
  sslCert,
  sslKey,
  rejectUnauthorized,
});
const isSslActive = !!ssl;

const rawPassword =
  env.DB_PASS ??
  env.DB_PASSWORD ??
  env.DATABASE_PASS ??
  env.DATABASE_PASSWORD ??
  (isSslActive ? '' : 'secret');
const password = rawPassword;
const database = env.DB_NAME || env.DATABASE_NAME || 'my_db';

// Migration & Shadow Database Overrides
const migrationHost = env.DB_MIGRATION_HOST || host;
const migrationPort = Number(env.DB_MIGRATION_PORT) || port;
const migrationUser = env.DB_MIGRATION_USER || user;
const migrationPassword = env.DB_MIGRATION_PASS ?? password;
const migrationDatabase = env.DB_MIGRATION_NAME || database;
const shadowDatabase =
  env.DB_MIGRATION_SHADOW_NAME || env.SHADOW_DB_NAME || undefined;

const migrationSslMode = env.DB_MIGRATION_SSL_MODE || sslMode;
const migrationSslCa = env.DB_MIGRATION_SSL_CA || sslCa;
const migrationSslCert = env.DB_MIGRATION_SSL_CC || sslCert;
const migrationSslKey = env.DB_MIGRATION_SSL_CK || sslKey;
const migrationRejectUnauthorized =
  parseBool(env.DB_MIGRATION_SSL_REJECT_UNAUTHORIZED) ?? rejectUnauthorized;

const migrationSsl = buildMariaDbSsl({
  sslMode: migrationSslMode,
  sslCa: migrationSslCa,
  sslCert: migrationSslCert,
  sslKey: migrationSslKey,
  rejectUnauthorized: migrationRejectUnauthorized,
});

const url =
  env.DATABASE_URL ||
  env.DB_URL ||
  formatDbUrl({
    host,
    port,
    user,
    password,
    database,
    sslMode,
    sslCa,
    sslCert,
    sslKey,
    rejectUnauthorized,
  });

const migrationUrl =
  env.MIGRATION_DATABASE_URL ||
  env.DB_MIGRATION_URL ||
  formatDbUrl({
    host: migrationHost,
    port: migrationPort,
    user: migrationUser,
    password: migrationPassword,
    database: migrationDatabase,
    sslMode: migrationSslMode,
    sslCa: migrationSslCa,
    sslCert: migrationSslCert,
    sslKey: migrationSslKey,
    rejectUnauthorized: migrationRejectUnauthorized,
  });

const shadowUrl =
  env.SHADOW_DATABASE_URL ||
  (shadowDatabase
    ? formatDbUrl({
        host: migrationHost,
        port: migrationPort,
        user: migrationUser,
        password: migrationPassword,
        database: shadowDatabase,
        sslMode: migrationSslMode,
        sslCa: migrationSslCa,
        sslCert: migrationSslCert,
        sslKey: migrationSslKey,
        rejectUnauthorized: migrationRejectUnauthorized,
      })
    : undefined);

export const config = {
  host,
  port,
  user,
  password,
  database,
  sslMode,
  sslCa,
  sslCert,
  sslKey,
  ssl,
  url,
  migrationUrl,
  shadowUrl,
  migrationSsl,
};

if (
  isProduction &&
  (!config.host ||
    !config.port ||
    !config.user ||
    (!config.password && !isSslActive) ||
    !config.database)
) {
  throw new Error('Missing Database environment variables for production');
}

export default config;

