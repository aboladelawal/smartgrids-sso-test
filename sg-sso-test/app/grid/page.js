import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import PickaxeEmbed from "./PickaxeEmbed";

export const dynamic = "force-dynamic";

export default async function GridPage() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p>
          Logged in to our portal as <strong>{session.email}</strong>
        </p>
        <form action="/api/logout" method="post">
          <button type="submit">Log out</button>
        </form>
      </div>
      <PickaxeEmbed deploymentId={process.env.PICKAXE_DEPLOYMENT_ID || ""} />
    </main>
  );
}
