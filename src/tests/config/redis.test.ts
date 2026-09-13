import { describe, it, expect } from 'bun:test';
import { buildRedisTlsOptions, readPemCertificate } from '@/config/redis';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

describe('buildRedisTlsOptions', () => {
  it('returns undefined when TLS is not enabled and no certs/flags provided', () => {
    const opts = buildRedisTlsOptions(undefined, undefined, undefined, undefined, undefined, undefined);
    expect(opts).toBeUndefined();
  });

  it('returns undefined when TLS is explicitly disabled', () => {
    const opts1 = buildRedisTlsOptions('false', undefined, undefined, undefined, undefined, { enabled: true });
    expect(opts1).toBeUndefined();

    const opts2 = buildRedisTlsOptions(undefined, undefined, undefined, undefined, undefined, { enabled: false });
    expect(opts2).toBeUndefined();
  });

  it('returns empty connection options when REDIS_TLS is true with no certs', () => {
    const opts = buildRedisTlsOptions('true');
    expect(opts).toBeDefined();
    expect(opts).toEqual({});
  });

  it('binds CA, cert, and key when provided via environment variables', () => {
    const opts = buildRedisTlsOptions(
      'true',
      'ca-pem-data',
      'cert-pem-data',
      'key-pem-data',
      'false',
    );
    expect(opts).toEqual({
      ca: 'ca-pem-data',
      cert: 'cert-pem-data',
      key: 'key-pem-data',
      rejectUnauthorized: false,
    });
  });

  it('binds rejectUnauthorized=true when env var is set to "true" or "1"', () => {
    const opts = buildRedisTlsOptions(
      'true',
      undefined,
      undefined,
      undefined,
      '1',
    );
    expect(opts).toEqual({
      rejectUnauthorized: true,
    });
  });

  it('falls back to TOML configuration when environment variables are unset', () => {
    const opts = buildRedisTlsOptions(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        enabled: true,
        ca: 'toml-ca-cert',
        cert: 'toml-client-cert',
        key: 'toml-client-key',
        rejectUnauthorized: false,
      },
    );
    expect(opts).toEqual({
      ca: 'toml-ca-cert',
      cert: 'toml-client-cert',
      key: 'toml-client-key',
      rejectUnauthorized: false,
    });
  });

  it('environment variables take precedence over TOML configuration', () => {
    const opts = buildRedisTlsOptions(
      'true',
      'env-ca',
      undefined,
      undefined,
      'true',
      {
        enabled: true,
        ca: 'toml-ca',
        cert: 'toml-cert',
        rejectUnauthorized: false,
      },
    );
    expect(opts?.ca).toBe('env-ca');
    expect(opts?.cert).toBe('toml-cert');
    expect(opts?.rejectUnauthorized).toBe(true);
  });
});

describe('readPemCertificate', () => {
  it('returns undefined when input is undefined or empty', () => {
    expect(readPemCertificate(undefined)).toBeUndefined();
    expect(readPemCertificate('')).toBeUndefined();
  });

  it('returns raw string when value is not an existing file path', () => {
    const inlinePem = '-----BEGIN CERTIFICATE-----\nTEST\n-----END CERTIFICATE-----';
    expect(readPemCertificate(inlinePem)).toBe(inlinePem);
  });

  it('reads certificate buffer from existing file path', () => {
    const tempFile = path.join(os.tmpdir(), `test-cert-${Date.now()}.pem`);
    const certContent = 'CERT-FILE-CONTENT';
    fs.writeFileSync(tempFile, certContent, 'utf8');

    try {
      const result = readPemCertificate(tempFile);
      expect(result).toBeDefined();
      expect(result?.toString()).toBe(certContent);
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });
});
