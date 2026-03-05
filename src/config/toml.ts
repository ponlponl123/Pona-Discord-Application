import { TOML } from 'bun';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { prefix as consolePrefix, type as consoleType } from './console';

export interface TomlConfig {
  title?: string;
  redis?: {
    sentinel?: {
      natmap?: Array<{
        nat: string;
        host: string;
        port: number;
      }>;
    };
  };
  [key: string]: unknown;
}

export function loadTomlConfig(): TomlConfig {
  const env = process.env.NODE_ENV || 'development';
  const rootDir = path.join(__dirname, '..', '..');
  const globalConfigPath = path.join(rootDir, 'config.toml');
  const envConfigPath = path.join(rootDir, `config.${env}.toml`);

  let config: TomlConfig = {};

  try {
    if (existsSync(globalConfigPath)) {
      const globalConfig = TOML.parse(readFileSync(globalConfigPath, 'utf-8'));
      config = { ...config, ...globalConfig };
      console.log(
        consoleType.info,
        consolePrefix.system,
        '✓ Loaded global config from: config.toml',
      );
    } else {
      console.log(
        consoleType.warn,
        consolePrefix.system,
        '⚠ Global config not found: config.toml (optional)',
      );
    }

    if (existsSync(envConfigPath)) {
      const envConfig = TOML.parse(readFileSync(envConfigPath, 'utf-8'));
      config = deepMerge(config, envConfig);
      console.log(
        consoleType.info,
        consolePrefix.system,
        `✓ Loaded ${env} config from: config.${env}.toml`,
      );
    } else {
      console.log(
        consoleType.warn,
        consolePrefix.system,
        `⚠ Environment config not found: config.${env}.toml`,
      );
    }

    return config;
  } catch (error) {
    console.error(
      consoleType.error,
      consolePrefix.system,
      '✗ Failed to load TOML config:',
      error,
    );
    return config;
  }
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    if (isObject(source[key]) && isObject(target[key])) {
      output[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      );
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

export const tomlConfig = loadTomlConfig();

export function getConfigValue<T = unknown>(path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let value: unknown = tomlConfig;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return defaultValue as T;
    }
  }

  return value as T;
}

export default tomlConfig;
