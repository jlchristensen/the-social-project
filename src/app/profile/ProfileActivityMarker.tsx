"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PROFILE_ACTIVITY_SEEN_EVENT } from "@/lib/profileActivityUnread";

/**
 * Bumps `activity_last_viewed_at` when the user opens /profile so the header
 * orb clears after they check their profile.
 */
export default function ProfileActivityMarker() {
  useEffect(() => {
    let cancelled = false;

    async function markSeen() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          activity_last_viewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (!error && !cancelled) {
        window.dispatchEvent(new CustomEvent(PROFILE_ACTIVITY_SEEN_EVENT));
      }
    }

    void markSeen();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
