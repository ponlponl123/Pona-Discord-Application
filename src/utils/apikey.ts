import { prisma } from '../prisma';

export interface APIKeyPermission {
  // generic permissions
  canUsePremiumEndpoints: boolean;
  rateLimitPerMinute: number;
  allowedIPAddresses: string[];
  // for developers
  canDebug: boolean;
  // specific permissions
  canManageUsers: boolean;
  canManageGuilds: boolean;
  canManageChannels: boolean;
  canManageRoles: boolean;
  canManageEmojis: boolean;
}

export enum DeveloperPermissions {
  DEBUG_ENABLED = 1,
}

export enum GenericPermissions {
  PREMIUM_ENDPOINTS_ENABLED = 1,
}

export enum ManagementPermissions {
  CAN_MANAGE_USERS = 1,
  CAN_MANAGE_GUILDS = 2,
  CAN_MANAGE_CHANNELS = 3,
  CAN_MANAGE_ROLES = 4,
  CAN_MANAGE_EMOJIS = 5,
}

export enum PermissionBitOffset {
  DEVELOPER_START = 0,
  GENERIC_START = 10,
  MANAGEMENT_START = 20,
}

export const PermissionBitValues = {
  DEBUG_ENABLED:
    1 <<
    (PermissionBitOffset.DEVELOPER_START +
      DeveloperPermissions.DEBUG_ENABLED -
      1),
  PREMIUM_ENDPOINTS_ENABLED:
    1 <<
    (PermissionBitOffset.GENERIC_START +
      GenericPermissions.PREMIUM_ENDPOINTS_ENABLED -
      1),
  CAN_MANAGE_USERS:
    1 <<
    (PermissionBitOffset.MANAGEMENT_START +
      ManagementPermissions.CAN_MANAGE_USERS -
      1),
  CAN_MANAGE_GUILDS:
    1 <<
    (PermissionBitOffset.MANAGEMENT_START +
      ManagementPermissions.CAN_MANAGE_GUILDS -
      1),
  CAN_MANAGE_CHANNELS:
    1 <<
    (PermissionBitOffset.MANAGEMENT_START +
      ManagementPermissions.CAN_MANAGE_CHANNELS -
      1),
  CAN_MANAGE_ROLES:
    1 <<
    (PermissionBitOffset.MANAGEMENT_START +
      ManagementPermissions.CAN_MANAGE_ROLES -
      1),
  CAN_MANAGE_EMOJIS:
    1 <<
    (PermissionBitOffset.MANAGEMENT_START +
      ManagementPermissions.CAN_MANAGE_EMOJIS -
      1),
};

export function permissionsToDecimal(
  permissions: Partial<APIKeyPermission>,
): number {
  let value = 0;

  if (permissions.canDebug) value |= PermissionBitValues.DEBUG_ENABLED;
  if (permissions.canUsePremiumEndpoints)
    value |= PermissionBitValues.PREMIUM_ENDPOINTS_ENABLED;
  if (permissions.canManageUsers) value |= PermissionBitValues.CAN_MANAGE_USERS;
  if (permissions.canManageGuilds)
    value |= PermissionBitValues.CAN_MANAGE_GUILDS;
  if (permissions.canManageChannels)
    value |= PermissionBitValues.CAN_MANAGE_CHANNELS;
  if (permissions.canManageRoles) value |= PermissionBitValues.CAN_MANAGE_ROLES;
  if (permissions.canManageEmojis)
    value |= PermissionBitValues.CAN_MANAGE_EMOJIS;

  return value;
}

export function decimalToPermissions(
  decimalValue: number,
  rateLimitPerMinute = 60,
  allowedIPAddresses: string[] = [],
): APIKeyPermission {
  const has = (bit: number) => (decimalValue & bit) === bit;
  return {
    canDebug: has(PermissionBitValues.DEBUG_ENABLED),
    canUsePremiumEndpoints: has(PermissionBitValues.PREMIUM_ENDPOINTS_ENABLED),
    rateLimitPerMinute,
    allowedIPAddresses,
    canManageUsers: has(PermissionBitValues.CAN_MANAGE_USERS),
    canManageGuilds: has(PermissionBitValues.CAN_MANAGE_GUILDS),
    canManageChannels: has(PermissionBitValues.CAN_MANAGE_CHANNELS),
    canManageRoles: has(PermissionBitValues.CAN_MANAGE_ROLES),
    canManageEmojis: has(PermissionBitValues.CAN_MANAGE_EMOJIS),
  };
}

export async function isApiKeyInDatabase(
  userIP: string,
  userAgent: string,
  key: string,
  returnPermissions?: boolean,
  loggingUsage?: boolean,
): Promise<APIKeyPermission | boolean> {
  try {
    const now = new Date();
    const apiKeyData = await prisma.api_key.findUnique({
      where: {
        key: key,
      },
    });

    if (!apiKeyData) return false;

    // Check expiration and status
    if (apiKeyData.expiredat && apiKeyData.expiredat < now) return false;
    if (apiKeyData.isdisabled && apiKeyData.isdisabled < now) return false;
    if (apiKeyData.isdeleted && apiKeyData.isdeleted < now) return false;

    if (apiKeyData.allowedipaddresses) {
      try {
        const allowedIPs = JSON.parse(apiKeyData.allowedipaddresses);
        if (Array.isArray(allowedIPs) && allowedIPs.length > 0 && !allowedIPs.includes(userIP)) {
           return false;
        }
      } catch {
        // Fallback for old comma-separated format if necessary
        const allowedIPs = apiKeyData.allowedipaddresses.split(',');
        if (allowedIPs.length > 0 && !allowedIPs.includes(userIP)) return false;
      }
    }

    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const logsCount = await prisma.api_key_logs.count({
      where: {
        key: key,
        time: {
          gt: oneMinuteAgo,
        },
      },
    });

    if (logsCount >= apiKeyData.ratelimitpermin) return false;

    if (loggingUsage) {
      await logApiKeyUsage(key, userIP, userAgent);
    }

    if (!returnPermissions) return true;

    const allowedIPs = apiKeyData.allowedipaddresses
      ? (JSON.parse(apiKeyData.allowedipaddresses) || [])
      : [];

    return decimalToPermissions(
      apiKeyData.permission,
      apiKeyData.ratelimitpermin,
      Array.isArray(allowedIPs) ? allowedIPs : [],
    );
  } catch (error) {
    console.error('Error checking API key in database:', error);
    return false;
  }
}

export async function logApiKeyUsage(
  apiKey: string,
  userIP: string,
  userAgent: string,
): Promise<void> {
  try {
    await prisma.api_key_logs.create({
      data: {
        key: apiKey,
        ip: userIP,
        user_agent: userAgent,
        time: new Date(),
      },
    });
  } catch (error) {
    console.error('Error logging API key usage:', error);
  }
}

export async function getDebugResponse(
  headers: Record<string, any>,
  debugData: any,
): Promise<{ debug?: any } | null> {
  const authorization = headers?.['pona-authorization'] || '';
  if (
    authorization &&
    typeof authorization === 'string' &&
    authorization.startsWith('Pona! ')
  ) {
    const apiKey = authorization.replace('Pona! ', '');
    const isValidKey = await isApiKeyInDatabase(
      headers?.['x-forwarded-for'] as string,
      headers?.['user-agent'] as string,
      apiKey,
      true,
    );
    if (isValidKey && typeof isValidKey !== 'boolean' && isValidKey.canDebug) {
      return { debug: debugData };
    }
  }
  return null;
}
