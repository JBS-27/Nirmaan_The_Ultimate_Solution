import { createHash } from "node:crypto";

/** Production origin for this Vercel project. */
export const PRODUCTION_ORIGIN = "https://nirmaan-the-ultimate-solution.vercel.app";

function trimEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
}

function asOrigin(hostOrUrl: string): string {
  if (hostOrUrl.startsWith("http://") || hostOrUrl.startsWith("https://")) return hostOrUrl.replace(/\/+$/, "");
  return `https://${hostOrUrl.replace(/\/+$/, "")}`;
}

function asHost(hostOrUrl: string): string {
  try {
    if (hostOrUrl.startsWith("http://") || hostOrUrl.startsWith("https://")) {
      return new URL(hostOrUrl).host;
    }
  } catch {
    /* fall through */
  }
  return hostOrUrl.replace(/\/+$/, "");
}

/** Hosts Better Auth may derive a base URL from (OAuth redirect_uri). */
export function deployAllowedHosts(): string[] {
  const hosts = new Set<string>(["*.vercel.app", asHost(PRODUCTION_ORIGIN)]);
  const vercelUrl = trimEnv("VERCEL_URL");
  const prod = trimEnv("VERCEL_PROJECT_PRODUCTION_URL");
  if (vercelUrl) hosts.add(asHost(vercelUrl));
  if (prod) hosts.add(asHost(prod));
  return [...hosts];
}

/** Origins accepted on credentialed auth POSTs (email sign-in, etc.). */
export function deployTrustedOrigins(): string[] {
  const origins = new Set<string>([PRODUCTION_ORIGIN, "https://*.vercel.app"]);
  const vercelUrl = trimEnv("VERCEL_URL");
  const prod = trimEnv("VERCEL_PROJECT_PRODUCTION_URL");
  if (vercelUrl) origins.add(asOrigin(vercelUrl));
  if (prod) origins.add(asOrigin(prod));
  return [...origins];
}

/**
 * Session signing secret that is STABLE across Vercel serverless isolates.
 * A random per-process secret logs everyone out on the next cold start.
 */
export function resolveAuthSecret(previewFallback: () => string): string {
  const explicit = trimEnv("BETTER_AUTH_SECRET") ?? trimEnv("AUTH_SECRET");
  if (explicit) return explicit;
  const databaseUrl = trimEnv("DATABASE_URL");
  if (databaseUrl) {
    return createHash("sha256").update(`nirmaan-auth:${databaseUrl}`).digest("hex");
  }
  return previewFallback();
}
