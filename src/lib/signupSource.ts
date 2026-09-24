import type { NextRequest, NextResponse } from "next/server";

/**
 * Where did this person come from?
 *
 * The first time someone lands with a signal (a `?utm_source=`, a `?ref=`, or
 * a referrer from another site), we remember it in a cookie. If they sign up
 * within 30 days, the sign-up form copies it into their account metadata
 * (`auth.users.raw_user_meta_data.signup_source`). That is the whole system:
 * no analytics vendor, and the answer to "which channel worked?" is one SQL
 * query away (see `docs/growth/signup-sources.sql`).
 *
 * First touch wins. A later visit never overwrites the cookie, so a person who
 * found us on TikTok and came back through a Google search still counts as
 * TikTok.
 */

export const SIGNUP_SOURCE_COOKIE = "tsp_src";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export interface SignupSource {
  /** Where they came from: "tiktok", "flyer", "share", "reddit.com", ... */
  source: string;
  medium?: string;
  campaign?: string;
  /** The page they first landed on. */
  landing: string;
  /** First-touch date, YYYY-MM-DD. */
  first_seen: string;
}

function clean(value: string | null): string | undefined {
  const trimmed = value?.trim().toLowerCase().slice(0, 64);
  return trimmed ? trimmed : undefined;
}

function externalReferrerHost(request: NextRequest): string | undefined {
  const referer = request.headers.get("referer");
  if (!referer) return undefined;
  try {
    const host = new URL(referer).hostname.replace(/^www\./, "");
    const ownHost = request.nextUrl.hostname.replace(/^www\./, "");
    return host && host !== ownHost ? host : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Called from the proxy on every page request. Sets the cookie the first time
 * a visitor arrives with a source signal; does nothing otherwise.
 */
export function rememberSignupSource(
  request: NextRequest,
  response: NextResponse
): void {
  if (request.method !== "GET") return;
  if (request.cookies.has(SIGNUP_SOURCE_COOKIE)) return;

  const params = request.nextUrl.searchParams;
  const source =
    clean(params.get("utm_source")) ??
    clean(params.get("ref")) ??
    externalReferrerHost(request);

  if (!source) return;

  const value: SignupSource = {
    source,
    medium: clean(params.get("utm_medium")),
    campaign: clean(params.get("utm_campaign")),
    landing: request.nextUrl.pathname,
    first_seen: new Date().toISOString().slice(0, 10),
  };

  response.cookies.set(SIGNUP_SOURCE_COOKIE, JSON.stringify(value), {
    maxAge: THIRTY_DAYS,
    path: "/",
    sameSite: "lax",
  });
}

/**
 * Read the remembered source in the browser, for the sign-up form. Returns
 * `null` when there is no cookie, which the query reads as "direct".
 */
export function readSignupSourceCookie(): SignupSource | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${SIGNUP_SOURCE_COOKIE}=`))
    ?.slice(SIGNUP_SOURCE_COOKIE.length + 1);
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as SignupSource;
  } catch {
    return null;
  }
}
