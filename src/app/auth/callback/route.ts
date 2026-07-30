import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Completes Supabase email-link auth (confirm signup, magic link, recovery).
 *
 * Recovery emails should set `next=/auth/update-password` so the user can
 * choose a new password after the session is established. Absolute `next`
 * URLs are rejected to avoid open redirects.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/profile";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/profile";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth-callback-failed`);
}
