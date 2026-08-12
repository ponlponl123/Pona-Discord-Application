import { container } from '@/core/container';
import GuildSettings from '@/interfaces/guildSettings';

const SETTINGS_CACHE_TTL = 300; // 5 minutes

export async function getGuildSettings(guildId: string): Promise<GuildSettings> {
  try {
    if (container.redis?.redis) {
      const cached = await container.redis.redis.get(`guild:settings:${guildId}`);
      if (cached) {
        return JSON.parse(cached) as GuildSettings;
      }
    }

    const pona = container.pona;
    const settings = (await pona?.loadGuildSettings(guildId)) || {};

    if (container.redis?.redis) {
      await container.redis.redis.setex(
        `guild:settings:${guildId}`,
        SETTINGS_CACHE_TTL,
        JSON.stringify(settings),
      );
    }

    return settings;
  } catch (error) {
    console.error(`Failed to get guild settings for ${guildId}:`, error);
    return {};
  }
}

export async function getGuildPNPTEnabled(guildId: string): Promise<boolean> {
  const settings = await getGuildSettings(guildId);
  return settings.pnpt_enabled ?? true;
}

export async function setGuildPNPTEnabled(guildId: string, enabled: boolean): Promise<boolean> {
  try {
    const pona = container.pona;
    if (!pona) return false;

    const currentSettings = await getGuildSettings(guildId);
    const updatedSettings: GuildSettings = {
      ...currentSettings,
      pnpt_enabled: enabled,
    };

    const saved = await pona.saveGuildSettings(guildId, updatedSettings);

    if (saved && container.redis?.redis) {
      await container.redis.redis.setex(
        `guild:settings:${guildId}`,
        SETTINGS_CACHE_TTL,
        JSON.stringify(updatedSettings),
      );
    }

    return saved;
  } catch (error) {
    console.error(`Failed to set guild PNPT enabled for ${guildId}:`, error);
    return false;
  }
}
