import { TOML } from 'bun';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { prefix as consolePrefix, type as consoleType } from './console';

/**
 * Type definition for your TOML configuration
 * Extend this interface based on your actual config structure
 */
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
  // Add more configuration sections as needed
  [key: string]: any;
}

/**
 * Loads TOML configuration files based on environment
 * Priority: config.[environment].toml > config.toml (global)
 * 
 * @returns Merged configuration object
 */
export function loadTomlConfig(): TomlConfig {
  const env = process.env.NODE_ENV || 'development';
  const rootDir = path.join(__dirname, '..', '..');
  
  // Config file paths
  const globalConfigPath = path.join(rootDir, 'config.toml');
  const envConfigPath = path.join(rootDir, `config.${env}.toml`);
  
  let config: TomlConfig = {};
  
  try {
    // 1. Load global config first (if exists)
    if (existsSync(globalConfigPath)) {
      const globalToml = readFileSync(globalConfigPath, 'utf-8');
      const globalConfig = TOML.parse(globalToml);
      config = { ...config, ...globalConfig };
      console.log(
        consoleType.info,
        consolePrefix.system,
        `✓ Loaded global config from: config.toml`
      );
    } else {
      console.log(
        consoleType.warn,
        consolePrefix.system,
        `⚠ Global config not found: config.toml (optional)`
      );
    }
    
    // 2. Load environment-specific config (overrides global)
    if (existsSync(envConfigPath)) {
      const envToml = readFileSync(envConfigPath, 'utf-8');
      const envConfig = TOML.parse(envToml);
      config = deepMerge(config, envConfig);
      console.log(
        consoleType.info,
        consolePrefix.system,
        `✓ Loaded ${env} config from: config.${env}.toml`
      );
    } else {
      console.log(
        consoleType.warn,
        consolePrefix.system,
        `⚠ Environment config not found: config.${env}.toml`
      );
    }
    
    return config;
  } catch (error) {
    console.error(
      consoleType.error,
      consolePrefix.system,
      `✗ Failed to load TOML config:`,
      error
    );
    return config;
  }
}

/**
 * Deep merge two objects (environment config overrides global)
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Export singleton config instance
 */
export const tomlConfig = loadTomlConfig();

/**
 * Utility function to get nested config values safely
 * 
 * @example
 * getConfigValue('redis.sentinel.natmap', [])
 */
export function getConfigValue<T = any>(path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let value: any = tomlConfig;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue as T;
    }
  }
  
  return value as T;
}

export default tomlConfig;
