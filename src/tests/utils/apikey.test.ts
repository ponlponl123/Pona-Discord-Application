import { describe, it, expect, mock } from 'bun:test';

// Mock the database import before importing apikey
mock.module('@/index', () => ({
  database: {
    pool: null,
    query: () => Promise.resolve([]),
    connect: () => Promise.resolve(),
  },
}));

import {
  permissionsToDecimal,
  decimalToPermissions,
  PermissionBitValues,
  DeveloperPermissions,
  GenericPermissions,
  ManagementPermissions,
  PermissionBitOffset,
  type APIKeyPermission,
} from '@/utils/apikey';

describe('PermissionBitValues', () => {
  it('DEBUG_ENABLED should be 1 (bit 0)', () => {
    expect(PermissionBitValues.DEBUG_ENABLED).toBe(1 << 0);
  });

  it('PREMIUM_ENDPOINTS_ENABLED uses GENERIC_START offset (bit 10)', () => {
    expect(PermissionBitValues.PREMIUM_ENDPOINTS_ENABLED).toBe(1 << 10);
  });

  it('CAN_MANAGE_USERS uses MANAGEMENT_START offset (bit 20)', () => {
    expect(PermissionBitValues.CAN_MANAGE_USERS).toBe(1 << 20);
  });

  it('all bit values are unique powers-of-two', () => {
    const values = Object.values(PermissionBitValues);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
    values.forEach((v) => expect(v & (v - 1)).toBe(0)); // power of 2 check
  });
});

describe('permissionsToDecimal', () => {
  it('returns 0 for empty permissions', () => {
    expect(permissionsToDecimal({})).toBe(0);
  });

  it('encodes canDebug correctly', () => {
    const val = permissionsToDecimal({ canDebug: true });
    expect(val & PermissionBitValues.DEBUG_ENABLED).toBe(
      PermissionBitValues.DEBUG_ENABLED,
    );
  });

  it('encodes canUsePremiumEndpoints correctly', () => {
    const val = permissionsToDecimal({ canUsePremiumEndpoints: true });
    expect(val & PermissionBitValues.PREMIUM_ENDPOINTS_ENABLED).toBe(
      PermissionBitValues.PREMIUM_ENDPOINTS_ENABLED,
    );
  });

  it('encodes multiple permissions without overlap', () => {
    const val = permissionsToDecimal({ canDebug: true, canManageUsers: true });
    expect(val & PermissionBitValues.DEBUG_ENABLED).toBe(
      PermissionBitValues.DEBUG_ENABLED,
    );
    expect(val & PermissionBitValues.CAN_MANAGE_USERS).toBe(
      PermissionBitValues.CAN_MANAGE_USERS,
    );
  });

  it('encodes all management permissions', () => {
    const perms: Partial<APIKeyPermission> = {
      canManageUsers: true,
      canManageGuilds: true,
      canManageChannels: true,
      canManageRoles: true,
      canManageEmojis: true,
    };
    const val = permissionsToDecimal(perms);
    expect(val & PermissionBitValues.CAN_MANAGE_GUILDS).toBe(
      PermissionBitValues.CAN_MANAGE_GUILDS,
    );
    expect(val & PermissionBitValues.CAN_MANAGE_CHANNELS).toBe(
      PermissionBitValues.CAN_MANAGE_CHANNELS,
    );
    expect(val & PermissionBitValues.CAN_MANAGE_ROLES).toBe(
      PermissionBitValues.CAN_MANAGE_ROLES,
    );
    expect(val & PermissionBitValues.CAN_MANAGE_EMOJIS).toBe(
      PermissionBitValues.CAN_MANAGE_EMOJIS,
    );
  });
});

describe('decimalToPermissions', () => {
  it('returns all false for 0', () => {
    const perms = decimalToPermissions(0);
    expect(perms.canDebug).toBe(false);
    expect(perms.canUsePremiumEndpoints).toBe(false);
    expect(perms.canManageUsers).toBe(false);
    expect(perms.canManageGuilds).toBe(false);
  });

  it('round-trips a permission set through permissionsToDecimal', () => {
    const original: Partial<APIKeyPermission> = {
      canDebug: true,
      canUsePremiumEndpoints: true,
      canManageUsers: false,
      canManageGuilds: true,
      canManageChannels: false,
      canManageRoles: false,
      canManageEmojis: false,
    };
    const decimal = permissionsToDecimal(original);
    const restored = decimalToPermissions(decimal);
    expect(restored.canDebug).toBe(true);
    expect(restored.canUsePremiumEndpoints).toBe(true);
    expect(restored.canManageUsers).toBe(false);
    expect(restored.canManageGuilds).toBe(true);
  });

  it('populates rateLimitPerMinute from parameter', () => {
    const perms = decimalToPermissions(0, 120);
    expect(perms.rateLimitPerMinute).toBe(120);
  });

  it('populates allowedIPAddresses from parameter', () => {
    const ips = ['192.168.1.1', '10.0.0.1'];
    const perms = decimalToPermissions(0, 60, ips);
    expect(perms.allowedIPAddresses).toEqual(ips);
  });
});

describe('Enum values', () => {
  it('DeveloperPermissions.DEBUG_ENABLED is 1', () => {
    expect(DeveloperPermissions.DEBUG_ENABLED).toBe(1);
  });

  it('GenericPermissions.PREMIUM_ENDPOINTS_ENABLED is 1', () => {
    expect(GenericPermissions.PREMIUM_ENDPOINTS_ENABLED).toBe(1);
  });

  it('ManagementPermissions starts at 1 and increments', () => {
    expect(ManagementPermissions.CAN_MANAGE_USERS).toBe(1);
    expect(ManagementPermissions.CAN_MANAGE_GUILDS).toBe(2);
    expect(ManagementPermissions.CAN_MANAGE_CHANNELS).toBe(3);
    expect(ManagementPermissions.CAN_MANAGE_ROLES).toBe(4);
    expect(ManagementPermissions.CAN_MANAGE_EMOJIS).toBe(5);
  });

  it('PermissionBitOffset values are correct', () => {
    expect(PermissionBitOffset.DEVELOPER_START).toBe(0);
    expect(PermissionBitOffset.GENERIC_START).toBe(10);
    expect(PermissionBitOffset.MANAGEMENT_START).toBe(20);
  });
});
