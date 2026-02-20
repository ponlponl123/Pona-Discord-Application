# TOML Configuration Guide

This project uses TOML configuration files for environment-specific and global settings.

## Configuration Files

### File Priority (from highest to lowest):

1. `config.[environment].toml` - Environment-specific (e.g., development, production)
2. `config.toml` - Global/universal settings

The system will merge these files automatically, with environment-specific settings overriding global ones.

## Setup Instructions

### 1. Create Global Config (Optional)

```bash
cp config.toml.example config.toml
```

Edit `config.toml` with settings that apply to ALL environments.

### 2. Create Environment-Specific Configs

**For Development:**

```bash
# Already exists - edit as needed
nano config.development.toml
```

**For Production:**

```bash
cp config.production.toml.example config.production.toml
nano config.production.toml
```

### 3. Configuration Structure

```toml
title = "Pona! Discord Application"

[redis]
# Redis configuration

[redis.sentinel]
natmap = [
    { nat = "redis-master:6379", host = "127.0.0.1", port = 6379 },
    { nat = "redis-replica-1:6380", host = "127.0.0.1", port = 6380 },
]

# Add more sections as needed
```

## Usage in Code

### Import the config:

```typescript
import { tomlConfig, getConfigValue } from '@/config/toml';

// Access the full config object
console.log(tomlConfig.title);
console.log(tomlConfig.redis?.sentinel?.natmap);

// Or use the helper function for safe access
const natmap = getConfigValue('redis.sentinel.natmap', []);
const title = getConfigValue('title', 'Default Title');
```

### Type Safety:

The config loader includes TypeScript types. Extend the `TomlConfig` interface in `src/config/toml.ts` to add type safety for your custom config sections:

```typescript
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
  // Add your custom types here
  myCustomSection?: {
    enabled: boolean;
    value: string;
  };
}
```

## Environment Variables

The config loader uses `process.env.NODE_ENV` to determine which config file to load:

- `development` → loads `config.development.toml`
- `production` → loads `config.production.toml`
- `test` → loads `config.test.toml`

## Example Workflow

```
┌─────────────────────────────────┐
│  NODE_ENV = "production"        │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│  1. Load config.toml (global)   │  ← Base settings
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│  2. Load config.production.toml │  ← Override with prod settings
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│  3. Deep merge configurations   │  ← Final config
└─────────────────────────────────┘
```

## Notes

- All `config.*.toml` files are gitignored for security
- Use `.example` files as templates
- Config files are loaded once at application startup
- Changes require application restart to take effect

## Security

⚠️ **NEVER commit actual config files to git!**

Only commit `.example` files with placeholder values.
