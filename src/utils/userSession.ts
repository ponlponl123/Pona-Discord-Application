import { createHash } from 'crypto';
import { prisma } from '@/prisma';

export interface UserSessionRecord {
  uid: string;
  ytmusic_visitor_id: string;
  ytmusic_cookie?: string | null;
  language?: string | null;
  country?: string | null;
  timezone?: string | null;
  user_agent?: string | null;
  ip_address?: string | null;
  sec_ch_ua?: string | null;
}

// In-memory cache to prevent database lookup latency on high-concurrency requests
const sessionCache = new Map<string, string>();
const fullSessionCache = new Map<string, UserSessionRecord>();
const MAX_CACHE_SIZE = 10000;

/**
 * Generates a unique, deterministic visitor ID for a Discord User ID.
 * Uses a unique 'pona_v1_' prefix and SHA-256 hash to ensure zero collision with native YTMusic IDs.
 */
export function generateUniqueVisitorId(uid: string): string {
  const hash = createHash('sha256')
    .update(`${uid}_pona_ytmusic_unique_salt_v1`)
    .digest('hex')
    .substring(0, 24);
  return `VISITOR_INFO1_LIVE=pona_v1_${hash}`;
}

/**
 * Retrieves the full stored user session & metadata record for a user.
 * Loads from in-memory cache or queries database, creating a new visitor record if none exists.
 */
export async function getUserSession(uid: string): Promise<UserSessionRecord> {
  if (!uid || typeof uid !== 'string') {
    const fallbackVisitor = 'VISITOR_INFO1_LIVE=pona_guest_default';
    return {
      uid: 'guest',
      ytmusic_visitor_id: fallbackVisitor,
      ytmusic_cookie: fallbackVisitor,
    };
  }

  if (fullSessionCache.has(uid)) {
    return fullSessionCache.get(uid)!;
  }

  const generatedVisitorId = generateUniqueVisitorId(uid);
  let sessionRecord: UserSessionRecord = {
    uid,
    ytmusic_visitor_id: generatedVisitorId,
    ytmusic_cookie: generatedVisitorId,
  };

  try {
    const userSession = await (prisma as any).user_session.findUnique({
      where: { uid },
    });

    if (userSession) {
      sessionRecord = {
        uid: userSession.uid,
        ytmusic_visitor_id: userSession.ytmusic_visitor_id,
        ytmusic_cookie: userSession.ytmusic_cookie || userSession.ytmusic_visitor_id,
        language: userSession.language || null,
        country: userSession.country || null,
        timezone: userSession.timezone || null,
        user_agent: userSession.user_agent || null,
        ip_address: userSession.ip_address || null,
        sec_ch_ua: userSession.sec_ch_ua || null,
      };
    } else {
      const newSession = await (prisma as any).user_session.create({
        data: {
          uid,
          ytmusic_visitor_id: generatedVisitorId,
        },
      });
      sessionRecord = {
        uid: newSession.uid,
        ytmusic_visitor_id: newSession.ytmusic_visitor_id,
        ytmusic_cookie: newSession.ytmusic_cookie || newSession.ytmusic_visitor_id,
        language: newSession.language || null,
        country: newSession.country || null,
        timezone: newSession.timezone || null,
        user_agent: newSession.user_agent || null,
        ip_address: newSession.ip_address || null,
        sec_ch_ua: newSession.sec_ch_ua || null,
      };
    }
  } catch (err) {
    console.warn(`[UserSession] DB lookup warning for uid ${uid}, using generated visitor ID:`, err);
  }

  if (fullSessionCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = fullSessionCache.keys().next().value;
    if (oldestKey) fullSessionCache.delete(oldestKey);
  }
  fullSessionCache.set(uid, sessionRecord);
  sessionCache.set(uid, sessionRecord.ytmusic_cookie || sessionRecord.ytmusic_visitor_id);

  return sessionRecord;
}

/**
 * Gets or creates a permanently assigned unique YouTube Music visitor cookie for a user.
 */
export async function getOrCreateUserVisitorCookie(uid: string): Promise<string> {
  const session = await getUserSession(uid);
  return session.ytmusic_cookie || session.ytmusic_visitor_id;
}

/**
 * Saves or updates a user's session metadata (language, country, timezone, user-agent, IP, sec-ch-ua, custom cookie) in the database.
 */
export async function saveUserSessionMetadata(
  uid: string,
  metadata: Partial<UserSessionRecord>,
): Promise<void> {
  if (!uid || typeof uid !== 'string') return;

  const generatedVisitorId = generateUniqueVisitorId(uid);
  const updateData: Record<string, any> = {};

  if (metadata.ytmusic_cookie !== undefined) updateData.ytmusic_cookie = metadata.ytmusic_cookie;
  if (metadata.language !== undefined) updateData.language = metadata.language;
  if (metadata.country !== undefined) updateData.country = metadata.country;
  if (metadata.timezone !== undefined) updateData.timezone = metadata.timezone;
  if (metadata.user_agent !== undefined) updateData.user_agent = metadata.user_agent;
  if (metadata.ip_address !== undefined) updateData.ip_address = metadata.ip_address;
  if (metadata.sec_ch_ua !== undefined) updateData.sec_ch_ua = metadata.sec_ch_ua;

  try {
    const updated = await (prisma as any).user_session.upsert({
      where: { uid },
      update: updateData,
      create: {
        uid,
        ytmusic_visitor_id: generatedVisitorId,
        ...updateData,
      },
    });

    const record: UserSessionRecord = {
      uid: updated.uid,
      ytmusic_visitor_id: updated.ytmusic_visitor_id,
      ytmusic_cookie: updated.ytmusic_cookie || updated.ytmusic_visitor_id,
      language: updated.language || null,
      country: updated.country || null,
      timezone: updated.timezone || null,
      user_agent: updated.user_agent || null,
      ip_address: updated.ip_address || null,
      sec_ch_ua: updated.sec_ch_ua || null,
    };

    fullSessionCache.set(uid, record);
    sessionCache.set(uid, record.ytmusic_cookie || record.ytmusic_visitor_id);
  } catch (err) {
    console.error(`[UserSession] Failed to save user session metadata for ${uid}:`, err);
  }
}

/**
 * Updates a user's custom YouTube authentication cookie in the database.
 */
export async function updateUserCookie(uid: string, customCookie: string): Promise<void> {
  await saveUserSessionMetadata(uid, { ytmusic_cookie: customCookie.trim() });
}

/**
 * Extracts metadata headers from an incoming request and persists them in DB for target user.
 */
export async function extractAndSaveIncomingUserMetadata(
  headers: Record<string, string | undefined>,
  uid?: string,
): Promise<void> {
  const targetUid = uid || headers['x-user-id'] || headers['x-uid'];
  if (!targetUid || typeof targetUid !== 'string') return;

  const language = headers['x-user-lang'] || headers['accept-language'];
  const country = headers['x-user-country'] || headers['cf-ipcountry'];
  const timezone = headers['x-user-timezone'] || headers['x-time-zone'];
  const user_agent = headers['x-user-agent'] || headers['user-agent'];
  const rawIp = headers['x-forwarded-for'] || headers['x-real-ip'];
  const ip_address = rawIp ? rawIp.split(',')[0].trim() : undefined;
  const sec_ch_ua = headers['sec-ch-ua'];
  const customCookie = headers['x-ytmusic-cookie'];

  await saveUserSessionMetadata(targetUid, {
    language: language || undefined,
    country: country || undefined,
    timezone: timezone || undefined,
    user_agent: user_agent || undefined,
    ip_address: ip_address || undefined,
    sec_ch_ua: sec_ch_ua || undefined,
    ytmusic_cookie: customCookie || undefined,
  });
}
