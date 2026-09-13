import fs from 'node:fs';
import type { ConnectionOptions } from 'node:tls';
import env from './env';
import toml from './toml';
import type { RedisClusterType, RedisTlsConfig } from '@/interfaces/redis';

export function readPemCertificate(val?: string): string | Buffer | undefined {
  if (!val) return undefined;
  if (fs.existsSync(val)) {
    try {
      return fs.readFileSync(val);
    } catch {
      return val;
    }
  }
  return val;
}

export function buildRedisTlsOptions(
  envTls?: string,
  envCa?: string,
  envCert?: string,
  envKey?: string,
  envRejectUnauthorized?: string,
  tomlTls?: RedisTlsConfig,
): ConnectionOptions | undefined {
  const isExplicitlyDisabled =
    envTls === 'false' || envTls === '0' || tomlTls?.enabled === false;
  if (isExplicitlyDisabled) return undefined;

  const isEnabled =
    envTls === 'true' ||
    envTls === '1' ||
    tomlTls?.enabled === true ||
    !!envCa ||
    !!envCert ||
    !!envKey ||
    !!tomlTls?.ca ||
    !!tomlTls?.cert ||
    !!tomlTls?.key;

  if (!isEnabled) return undefined;

  const caPath = envCa || tomlTls?.ca;
  const certPath = envCert || tomlTls?.cert;
  const keyPath = envKey || tomlTls?.key;

  const ca = readPemCertificate(caPath);
  const cert = readPemCertificate(certPath);
  const key = readPemCertificate(keyPath);

  let rejectUnauthorized: boolean | undefined = undefined;
  if (envRejectUnauthorized !== undefined) {
    rejectUnauthorized =
      envRejectUnauthorized === 'true' || envRejectUnauthorized === '1';
  } else if (tomlTls?.rejectUnauthorized !== undefined) {
    rejectUnauthorized = tomlTls.rejectUnauthorized;
  }

  const tlsOpts: ConnectionOptions = {};
  if (ca) tlsOpts.ca = ca;
  if (cert) tlsOpts.cert = cert;
  if (key) tlsOpts.key = key;
  if (rejectUnauthorized !== undefined) {
    tlsOpts.rejectUnauthorized = rejectUnauthorized;
  }

  return tlsOpts;
}

const {
  REDIS_ENABLED,
  REDIS_SENTINEL_ENABLED,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_NAME,
  REDIS_DB,
  REDIS_PREFIX,
  REDIS_TLS,
  REDIS_TLS_CA,
  REDIS_TLS_CERT,
  REDIS_TLS_KEY,
  REDIS_TLS_REJECT_UNAUTHORIZED,
  REDIS_SENTINEL_HOST,
  REDIS_SENTINEL_PORT,
  REDIS_SENTINEL_PASSWORD,
  REDIS_SENTINEL_HOST_2,
  REDIS_SENTINEL_PORT_2,
  REDIS_SENTINEL_HOST_3,
  REDIS_SENTINEL_PORT_3,
  REDIS_SENTINEL_TLS,
  REDIS_SENTINEL_TLS_CA,
  REDIS_SENTINEL_TLS_CERT,
  REDIS_SENTINEL_TLS_KEY,
  REDIS_SENTINEL_TLS_REJECT_UNAUTHORIZED,
} = env;

function parseBool(val?: string): boolean | undefined {
  if (val === 'true' || val === '1') return true;
  if (val === 'false' || val === '0') return false;
  return undefined;
}

function buildSentinels() {
  if (REDIS_SENTINEL_ENABLED !== 'true') return [];
  const sentinels = [
    {
      host: REDIS_SENTINEL_HOST || 'localhost',
      port: parseInt(REDIS_SENTINEL_PORT || '26379'),
    },
  ];
  if (REDIS_SENTINEL_HOST_2)
    sentinels.push({
      host: REDIS_SENTINEL_HOST_2,
      port: parseInt(REDIS_SENTINEL_PORT_2 || '26379'),
    });
  if (REDIS_SENTINEL_HOST_3)
    sentinels.push({
      host: REDIS_SENTINEL_HOST_3,
      port: parseInt(REDIS_SENTINEL_PORT_3 || '26379'),
    });
  return sentinels;
}

const tomlRedisTls = toml?.redis?.tls;
const tomlSentinelTls = toml?.redis?.sentinel?.tls;

const redisTls = buildRedisTlsOptions(
  REDIS_TLS,
  REDIS_TLS_CA,
  REDIS_TLS_CERT,
  REDIS_TLS_KEY,
  REDIS_TLS_REJECT_UNAUTHORIZED,
  tomlRedisTls,
);

const sentinelTls = buildRedisTlsOptions(
  REDIS_SENTINEL_TLS,
  REDIS_SENTINEL_TLS_CA,
  REDIS_SENTINEL_TLS_CERT,
  REDIS_SENTINEL_TLS_KEY,
  REDIS_SENTINEL_TLS_REJECT_UNAUTHORIZED,
  tomlSentinelTls,
);

export const config = {
  REDIS_ENABLED: parseBool(REDIS_ENABLED),
  REDIS_SENTINEL_ENABLED: parseBool(REDIS_SENTINEL_ENABLED),
  REDIS_HOST: REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(REDIS_PORT || '6379'),
  REDIS_PASSWORD: REDIS_PASSWORD || undefined,
  REDIS_SENTINEL_PASSWORD: REDIS_SENTINEL_PASSWORD || undefined,
  REDIS_NAME: REDIS_NAME || undefined,
  REDIS_PREFIX: REDIS_PREFIX || 'pona:',
  REDIS_DB: parseInt(REDIS_DB || '0'),
  REDIS_TYPE: (REDIS_SENTINEL_ENABLED === 'true'
    ? 'sentinel'
    : 'standalone') as RedisClusterType,
  sentinels: buildSentinels(),
  tls: redisTls,
  sentinelTLS: sentinelTls,
};

export default config;
