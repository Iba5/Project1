"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-xl font-semibold text-brand-heading">
        Couldn&apos;t load the site
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong on our end. Please try again in a moment — if it keeps happening, reach out and let us know.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
