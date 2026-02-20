#!/bin/sh
set -e

# Wait for the master to be resolvable via Docker DNS
echo "Waiting for redis-masterer to be resolvable..."
while ! getent hosts redis-masterer > /dev/null 2>&1; do
  sleep 1
done

MASTER_IP=$(getent hosts redis-masterer | awk '{ print $1 }')
echo "Resolved redis-masterer to $MASTER_IP"

# Generate sentinel config with the resolved IP
cat > /tmp/sentinel.conf <<EOF
port 26379
dir /tmp
sentinel monitor mymaster $MASTER_IP 6379 2
sentinel auth-pass mymaster masterpass
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 10000
sentinel parallel-syncs mymaster 1
EOF

exec redis-sentinel /tmp/sentinel.conf
