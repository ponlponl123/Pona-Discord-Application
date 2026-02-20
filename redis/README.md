# Redis Sentinel for Pona! Development

## Quick Start

To start the Redis Sentinel setup for development:

```powershell
docker-compose up -d
```

## Connection Details

- **Master**: `localhost:6379` (password: `masterpass`)
- **Replica 1**: `localhost:6380` (password: `masterpass`)
- **Replica 2**: `localhost:6381` (password: `masterpass`)
- **Sentinels**: `localhost:26379`, `localhost:26380`, `localhost:26381`

> [!NOTE]
> All instances (master + replicas) use the same password (`masterpass`) — required for Sentinel to monitor and failover correctly.

## Accessing Redis

### CLI

```powershell
docker exec -it redis-masterer redis-cli -a masterpass
```

### Application Config (Node/IORedis)

#### Option 1: Sentinel Mode (recommended for production-like testing)

To use Sentinel discovery with natMap translation (Docker IPs → localhost ports), create **`config.development.toml`** in the project root:

```toml
[redis.sentinel]
[[redis.sentinel.natmap]]
nat = "172.18.0.2:6379"    # Docker master IP (see docker compose logs for actual IP)
host = "127.0.0.1"
port = 6379

[[redis.sentinel.natmap]]
nat = "172.18.0.3:6379"    # Docker replica-1 IP
host = "127.0.0.1"
port = 6380

[[redis.sentinel.natmap]]
nat = "172.18.0.4:6379"    # Docker replica-2 IP
host = "127.0.0.1"
port = 6381
```

Then set in `.env.development`:

```env
REDIS_SENTINEL_ENABLED=true
REDIS_PASSWORD=masterpass
REDIS_SENTINEL_PASSWORD=''
REDIS_NAME=mymaster

REDIS_SENTINEL_HOST=127.0.0.1
REDIS_SENTINEL_PORT=26379
REDIS_SENTINEL_HOST_2=127.0.0.1
REDIS_SENTINEL_PORT_2=26380
REDIS_SENTINEL_HOST_3=127.0.0.1
REDIS_SENTINEL_PORT_3=26381
```

**Important:** Docker container IPs (172.18.x.x) change each time you restart containers. If connections fail after restart, check the docker compose logs for the new IPs and update the natMap in `config.development.toml`.

#### Option 2: Direct Connection (simple development)

Skip Sentinel and connect directly:

```env
REDIS_SENTINEL_ENABLED=false
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=masterpass
REDIS_DB=0
```

## Sentinel Dynamic IP Resolution

Sentinel resolves the master IP dynamically via `sentinel-entrypoint.sh` at startup using Docker DNS (`redis-masterer`). This allows the setup to work on any machine without hardcoded IPs.

The script:

1. Resolves `redis-masterer` hostname to its Docker container IP
2. Generates `sentinel.conf` at runtime with the correct IP
3. Starts `redis-sentinel` with the dynamic config

This pattern makes the cluster **portable across machines** while using sentinel discovery.
