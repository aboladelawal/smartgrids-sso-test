import { redirect } from "next/navigation";
import { getSession } from "../lib/session";
import { testTeachers } from "../lib/teachers";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  if (await getSession()) redirect("/grid");
  const teachers = testTeachers();
  const error = (await searchParams)?.error;

  return (
    <main>
      <h1>Smart Grids portal (test)</h1>
      <p>Throwaway test page for task 1.1. Pick a test teacher to log in as.</p>
      {error && <p style={{ color: "crimson" }}>That teacher is not on the test list.</p>}
      {teachers.length === 0 ? (
        <p style={{ color: "crimson" }}>No test teachers set. Add TEST_TEACHERS in the environment variables.</p>
      ) : (
        <form action="/api/login" method="post">
          <select name="email" style={{ padding: 8, fontSize: 16 }}>
            {teachers.map((t) => (
              <option key={t.email} value={t.email}>
                {t.email} ({t.label})
              </option>
            ))}
          </select>{" "}
          <button type="submit" style={{ padding: "8px 16px", fontSize: 16 }}>Log in</button>
        </form>
      )}
    </main>
  );
}
