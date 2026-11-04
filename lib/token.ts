import { jwtVerify, SignJWT } from 'jose';

export const SESSION_COOKIE = 'am_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET is missing or shorter than 32 characters. Set it in .env.');
  }
  return new TextEncoder().encode(secret);
}

export type SessionClaims = { uid: number; username: string; v: number };

export function signToken(claims: SessionClaims) {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key());
}

export async function verifyToken(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    // key() inside try: a missing AUTH_SECRET means "not logged in", not a crashed proxy.
    const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
    return { uid: Number(payload.uid), username: String(payload.username), v: Number(payload.v) };
  } catch {
    return null;
  }
}
