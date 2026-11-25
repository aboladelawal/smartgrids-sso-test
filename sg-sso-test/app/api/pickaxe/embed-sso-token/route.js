import { NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";
import { getSession } from "../../../../lib/session";
import { portalUserId } from "../../../../lib/teachers";

// Called by the Pickaxe embed (via getJwt on the grid page).
// Reads who is logged in from our own cookie and returns a short-lived signed
// token that tells Pickaxe "this is the teacher, we have already checked them".
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "not logged in" }, { status: 401 });
  }

  const {
    PICKAXE_PRIVATE_KEY,
    PICKAXE_KEY_ID,
    PICKAXE_ISSUER,
    PICKAXE_WORKSPACE_ID,
  } = process.env;

  if (!PICKAXE_PRIVATE_KEY || !PICKAXE_KEY_ID || !PICKAXE_ISSUER || !PICKAXE_WORKSPACE_ID) {
    return NextResponse.json({ error: "Pickaxe settings missing on server" }, { status: 500 });
  }

  // Vercel sometimes stores newlines as literal "\n"; put them back.
  const pem = PICKAXE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const key = await importPKCS8(pem, "ES256");

  const sub = portalUserId(session.email);

  const token = await new SignJWT({
    customer_id: PICKAXE_WORKSPACE_ID,
    email: session.email,
    external_user_id: sub,
  })
    .setProtectedHeader({ alg: "ES256", kid: PICKAXE_KEY_ID, typ: "JWT" })
    .setIssuer(PICKAXE_ISSUER)
    .setAudience("pickaxe-embed")
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);

  return NextResponse.json({ token });
}
