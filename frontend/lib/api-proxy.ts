/**
 * Shared proxy utility for forwarding requests from Next.js API routes
 * to the FastAPI backend running on port 3001.
 *
 * Includes lazy-start mechanism: if the FastAPI service is down,
 * it will attempt to start it and retry the request.
 */

const API_BASE = "http://localhost:3001/api/v1";
const FASTAPI_HEALTH = "http://localhost:3001/health";

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
 * Check if the FastAPI service is running.
 */
async function isFastAPIRunning(): Promise<boolean> {
  try {
    const res = await fetch(FASTAPI_HEALTH, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Start the FastAPI service using the mini-service's start script.
 * Returns true if the service started successfully.
 */
async function startFastAPI(): Promise<boolean> {
  const { exec } = await import("child_process");
  const { promisify } = await import("util");
  const path = await import("path");
  const execAsync = promisify(exec);

  const fs = await import("fs");
  const cwd = process.cwd();
  const apiDir = fs.existsSync(path.join(cwd, "backend"))
    ? path.join(cwd, "backend")
    : path.resolve(cwd, "..", "backend");

  try {
    // Start the FastAPI service in the background
    execAsync(
      `cd "${apiDir}" && ./venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 3001 --no-access-log`,
      { detached: true, stdio: "ignore" } as Parameters<typeof exec>[1],
    ).catch(() => {
      // Don't throw — the process is detached
    });

    // Wait for the service to be ready (up to 15 seconds)
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      if (await isFastAPIRunning()) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Proxies a request to the FastAPI backend.
 *
 * Server-side only — this runs inside Next.js API route handlers
 * and calls http://localhost:3001 directly (no gateway needed).
 *
 * If the FastAPI service is down, it will attempt to start it
 * and retry the request once.
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

  // First attempt
  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      signal: AbortSignal.timeout(10000),
    });

    if (response.status === 204) {
      return { data: null as T, status: 204 };
    }

    const data = await response.json();
    return { data: data as T, status: response.status };
  } catch (firstError) {
    // FastAPI might be down — try to start it
    console.warn("[api-proxy] FastAPI might be down, attempting to start...");

    const started = await startFastAPI();
    if (!started) {
      console.error("[api-proxy] Failed to start FastAPI service");
      throw firstError;
    }

    // Retry the request
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      signal: AbortSignal.timeout(10000),
    });

    if (response.status === 204) {
      return { data: null as T, status: 204 };
    }

    const data = await response.json();
    return { data: data as T, status: response.status };
  }
}
