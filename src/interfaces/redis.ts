export type RedisClusterType = 'standalone' | 'sentinel';

export interface RedisTlsConfig {
  enabled?: boolean;
  ca?: string;
  cert?: string;
  key?: string;
  rejectUnauthorized?: boolean;
}