import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { rememberSignupSource } from "@/lib/signupSource";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  rememberSignupSource(request, response);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|og/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
