import { createHash } from 'crypto';
import { prisma } from '@/prisma';

// In-memory cache to prevent database lookup latency on high-concurrency requests
const sessionCache = new Map<string, string>();
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
 * Gets or creates a permanently assigned unique YouTube Music visitor cookie for a user.
 * If the user has a custom YouTube account cookie saved in DB, returns that cookie.
 * Otherwise, generates and permanently saves a unique visitor ID for the user in DB.
 */
export async function getOrCreateUserVisitorCookie(uid: string): Promise<string> {
  if (!uid || typeof uid !== 'string') {
    return 'VISITOR_INFO1_LIVE=pona_guest_default';
  }

  // 1. Check in-memory fast cache
  if (sessionCache.has(uid)) {
    return sessionCache.get(uid)!;
  }

  const generatedVisitorId = generateUniqueVisitorId(uid);
  let finalCookie = generatedVisitorId;

  try {
    // 2. Query database for user_session
    const userSession = await prisma.user_session.findUnique({
      where: { uid },
    });

    if (userSession) {
      finalCookie = userSession.ytmusic_cookie || userSession.ytmusic_visitor_id;
    } else {
      // 3. Permanently assign new unique visitor ID in DB
      await prisma.user_session.create({
        data: {
          uid,
          ytmusic_visitor_id: generatedVisitorId,
        },
      });
    }
  } catch (err) {
    // Fallback: If DB table not migrated yet, use raw query or generated ID gracefully
    console.warn(`[UserSession] DB lookup warning for uid ${uid}, using generated visitor ID:`, err);
  }

  // 4. Update in-memory cache
  if (sessionCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = sessionCache.keys().next().value;
    if (oldestKey) sessionCache.delete(oldestKey);
  }
  sessionCache.set(uid, finalCookie);

  return finalCookie;
}

/**
 * Updates a user's custom YouTube authentication cookie in the database.
 */
export async function updateUserCookie(uid: string, customCookie: string): Promise<void> {
  const generatedVisitorId = generateUniqueVisitorId(uid);
  const cookieValue = customCookie.trim();

  await prisma.user_session.upsert({
    where: { uid },
    update: {
      ytmusic_cookie: cookieValue,
    },
    create: {
      uid,
      ytmusic_visitor_id: generatedVisitorId,
      ytmusic_cookie: cookieValue,
    },
  });

  sessionCache.set(uid, cookieValue);
}
