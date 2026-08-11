/**
 * Shared proxy utility for forwarding requests from Next.js API routes
 * to the FastAPI backend.
 *
 * Backend URL comes from NEXT_PUBLIC_API_URL — no hardcoded fallback. A
 * missing env var must fail loudly and immediately, not silently try
 * "localhost:3001", which doesn't exist on a deployed host and would just
 * produce a confusing connection-refused error instead of a clear one.
 */

function requireBackendUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to your .env (see .env.example) — " +
        "it must point at the FastAPI backend (e.g. http://localhost:3001 locally, " +
        "or the deployed backend URL in production).",
    );
  }
  return raw.replace(/\/$/, "");
}

const BACKEND_URL = requireBackendUrl();

export const API_BASE = `${BACKEND_URL}/api/v1`;

export interface ProxyOptions {
  method: string;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
}

export interface ProxyResult<T = unknown> {
  data: T;
  status: number;
}

/**
 * Proxies a request to the FastAPI backend.
 *
 * Server-side only — this runs inside Next.js API route handlers.
 */
export async function apiProxy<T = unknown>(
  options: ProxyOptions,
): Promise<ProxyResult<T>> {
  const url = new URL(`${API_BASE}${options.path}`);

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const fetchOptions: RequestInit = {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (options.body && options.method !== "GET") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      ...fetchOptions,
      signal: AbortSignal.timeout(10000),
    });
  } catch (cause) {
    const reason = cause instanceof Error && cause.name === "TimeoutError"
      ? "the request timed out after 10s"
      : "the backend could not be reached";
    throw new Error(
      `Backend request failed: ${options.method} ${options.path} — ${reason} (${url.origin})`,
      { cause },
    );
  }

  if (response.status === 204) {
    return { data: null as T, status: 204 };
  }

  try {
    const data = await response.json();
    return { data: data as T, status: response.status };
  } catch (cause) {
    throw new Error(
      `Backend response was not valid JSON: ${options.method} ${options.path} (status ${response.status})`,
      { cause },
    );
  }
}
