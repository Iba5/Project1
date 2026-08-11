"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1.5rem", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Couldn&apos;t load the site</h1>
          <p style={{ maxWidth: "28rem", fontSize: "0.875rem", color: "#666" }}>
            Something went wrong on our end. Please try again in a moment — if it keeps happening, reach out and let us know.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ borderRadius: "0.5rem", background: "#0f1b33", color: "#fff", padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 600 }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
