import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// secret key useed to identify the session
const SECRET_KEY = process.env.SESSION_SECRET;

// encode the secret key
const ENCODED_KEY = new TextEncoder().encode(SECRET_KEY);

type sessionPayload = {
  userId: string;
  expiresAt: Date;
};

// encrypt function
export async function encrypt(sessionData: sessionPayload) {
  return await new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(ENCODED_KEY);
}

// decrypt function
export async function decrypt(session: string | undefined = "") {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, ENCODED_KEY, {
      algorithms: ["HS256"],
    }); // decode the session data

    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
  }
}

//  create session function
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const session = await encrypt({ userId, expiresAt });

  const cookieStore = await cookies();

  //   set the cookie with the session data
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "strict",
  });
}

// delete session function
export async function deleteSession() {
  const cookieStore = await cookies();
  //   delete the cookie with the session data
  await cookieStore.delete("session");
}

// get current session data function
export async function getSessionData() {
  const cookieStore = await cookies();
  const cookieData = await cookieStore.get("session")?.value;
  if (!cookieData) return null;
  const session = await decrypt(cookieData);

  return session as sessionPayload | null;
}
