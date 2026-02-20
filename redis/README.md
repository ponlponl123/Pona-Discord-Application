# Redis Sentinel for Pona! Development

## Quick Start

To start the Redis Sentinel setup for development:

```powershell
docker-compose up -d
```

## Connection Details

- **Master**: `localhost:6379` (password: `masterpass`)
- **Replica 1**: `localhost:6380` (password: `replicapass`)
- **Replica 2**: `localhost:6381` (password: `replicapass`)
- **Sentinels**: `localhost:26379`, `localhost:26380`, `localhost:26381`

## Accessing Redis

### CLI

```powershell
docker exec -it redis-masterer redis-cli -a masterpass
```

### Application Config (Node/IORedis)

Config for `src/redis.ts`:

```env
REDIS_SENTINEL_ENABLED=true
REDIS_PASSWORD=masterpass
# Sentinel 1 (Default)
REDIS_SENTINEL_HOST=localhost
REDIS_SENTINEL_PORT=26379
# Sentinel 2 (Optional)
REDIS_SENTINEL_HOST_2=localhost
REDIS_SENTINEL_PORT_2=26380
# Sentinel 3 (Optional)
REDIS_SENTINEL_HOST_3=localhost
REDIS_SENTINEL_PORT_3=26381

REDIS_NAME=mymaster
```

> [!NOTE]
> Replicas require `replicapass` for direct connections, but sentinel and master use `masterpass`.
