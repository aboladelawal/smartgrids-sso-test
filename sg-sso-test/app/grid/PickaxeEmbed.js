"use client";

import { useEffect, useState } from "react";

// Loads one Pickaxe grid and hands it our signed token, following
// https://pickaxe.co/v1/documentation/authenticated-embeds
// The log box underneath records what happened, for the write-up.
export default function PickaxeEmbed({ deploymentId }) {
  const [log, setLog] = useState([]);
  const add = (msg) => setLog((l) => [...l, `${new Date().toLocaleTimeString()}  ${msg}`]);

  useEffect(() => {
    if (!deploymentId) {
      add("PICKAXE_DEPLOYMENT_ID is not set.");
      return;
    }
    add(`Browser: ${navigator.userAgent}`);

    window.PickaxeConfig = {
      [`deployment-${deploymentId}`]: {
        sso: {
          getJwt: async (ctx) => {
            add(`Pickaxe asked for a token (${JSON.stringify(ctx || {})})`);
            try {
              const res = await fetch("/api/pickaxe/embed-sso-token", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ctx || {}),
              });
              const data = await res.json();
              if (!res.ok || !data.token) {
                add(`Token request failed: ${res.status} ${data.error || ""}`);
                return null;
              }
              add("Token sent to Pickaxe.");
              return data.token;
            } catch (e) {
              add(`Token request error: ${e.message}`);
              return null;
            }
          },
        },
      },
    };

    if (!document.querySelector('script[data-pickaxe-bundle]')) {
      const s = document.createElement("script");
      s.src = "https://studio.pickaxe.co/api/embed/bundle.js";
      s.defer = true;
      s.dataset.pickaxeBundle = "1";
      s.onload = () => add("Pickaxe embed script loaded.");
      s.onerror = () => add("Pickaxe embed script failed to load (blocked?).");
      document.body.appendChild(s);
    }
  }, [deploymentId]);

  return (
    <>
      <div id={`deployment-${deploymentId}`} style={{ minHeight: 600, border: "1px solid #ddd" }} />
      <h3>Test log</h3>
      <pre style={{ background: "#f5f5f5", padding: 12, whiteSpace: "pre-wrap", fontSize: 12 }}>
        {log.join("\n") || "Waiting..."}
      </pre>
    </>
  );
}
