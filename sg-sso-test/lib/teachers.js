// The fake "portal" knows only these teachers.
export function testTeachers() {
  const list = (process.env.TEST_TEACHERS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .map((email) => ({ email, label: "New test teacher" }));

  const existing = (process.env.EXISTING_TEACHER_EMAIL || "").trim().toLowerCase();
  if (existing) list.push({ email: existing, label: "Existing Pickaxe user (duplicate check)" });

  return list;
}

export function isTestTeacher(email) {
  return testTeachers().some((t) => t.email === email);
}

// Stable ID for a teacher in "our" system. In the real portal this will be the
// Supabase user ID. Here it is derived from the email so it never changes between logins.
export function portalUserId(email) {
  return "sgtest_" + Buffer.from(email).toString("base64url");
}
