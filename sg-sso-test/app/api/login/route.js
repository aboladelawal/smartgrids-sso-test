import { NextResponse } from "next/server";
import { setSession } from "../../../lib/session";
import { isTestTeacher } from "../../../lib/teachers";

export async function POST(request) {
  const form = await request.formData();
  const email = String(form.get("email") || "").toLowerCase();
  if (!isTestTeacher(email)) {
    return NextResponse.redirect(new URL("/?error=unknown", request.url), 303);
  }
  await setSession(email);
  return NextResponse.redirect(new URL("/grid", request.url), 303);
}
