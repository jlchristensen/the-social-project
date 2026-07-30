"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  PROFILE_ACTIVITY_SEEN_EVENT,
  fetchHasUnreadProfileActivity,
} from "@/lib/profileActivityUnread";
import type { User } from "@supabase/supabase-js";
import CampfireMark from "@/components/layout/CampfireMark";

/** Local design preview only — ignored in production builds. */
const previewProfileNotificationDot =
  process.env.NODE_ENV === "development" &&
  (process.env.NEXT_PUBLIC_PREVIEW_PROFILE_NOTIFICATION === "true" ||
    process.env.NEXT_PUBLIC_PREVIEW_PROFILE_NOTIFICATION === "1");

/**
 * The header is just the wordmark and the door: profile or sign in.
 * The homepage IS the Campfire, so there is no nav to navigate.
 */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  /** On the Campfire (home) only: hide chrome while scrolling down for immersion. */
  const [campfireImmersiveHidden, setCampfireImmersiveHidden] = useState(false);
  const lastScrollY = useRef(0);

  const solid = scrolled;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUnreadProfileActivity, setHasUnreadProfileActivity] =
    useState(false);

  const onCampfire = pathname === "/";

  useEffect(() => {
    lastScrollY.current =
      typeof window !== "undefined" ? window.scrollY : 0;
    setCampfireImmersiveHidden(false);
  }, [pathname]);

  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 60);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!onCampfire || reduceMotion) {
        setCampfireImmersiveHidden(false);
        lastScrollY.current = y;
        return;
      }

      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      if (y < 56) {
        setCampfireImmersiveHidden(false);
        return;
      }
      if (delta > 8) setCampfireImmersiveHidden(true);
      else if (delta < -8) setCampfireImmersiveHidden(false);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [onCampfire]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function refreshUnread() {
      if (!user?.id) {
        setHasUnreadProfileActivity(false);
        return;
      }
      const has = await fetchHasUnreadProfileActivity(user.id);
      if (!cancelled) setHasUnreadProfileActivity(has);
    }

    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      await refreshUnread();
    })();

    function onActivitySeen() {
      void refreshUnread();
    }

    function onVisible() {
      if (document.visibilityState === "visible") void refreshUnread();
    }

    window.addEventListener(PROFILE_ACTIVITY_SEEN_EVENT, onActivitySeen);
    document.addEventListener("visibilitychange", onVisible);

    const interval = window.setInterval(() => void refreshUnread(), 60_000);

    return () => {
      cancelled = true;
      window.removeEventListener(PROFILE_ACTIVITY_SEEN_EVENT, onActivitySeen);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
    };
  }, [user?.id, pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const immersiveHide = onCampfire && campfireImmersiveHidden;

  const showUnreadProfileDot =
    previewProfileNotificationDot || hasUnreadProfileActivity;

  return (
    <header
      className={`fixed top-0 z-50 w-full ease-out will-change-transform ${
        onCampfire
          ? "transition-[transform,background-color,backdrop-filter,border-color,padding,box-shadow] duration-300"
          : "transition-[background-color,backdrop-filter,border-color,padding,box-shadow] duration-700"
      } ${
        immersiveHide
          ? "pointer-events-none -translate-y-full"
          : "translate-y-0"
      } ${
        solid
          ? "border-b border-white/10 bg-brand-900/85 py-3 shadow-[0_8px_30px_-15px_rgba(0,32,15,0.6)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <CampfireMark className="h-7 w-7 -translate-y-0.5 transition-transform duration-500 group-hover:scale-110" />
          <span className="font-display text-lg leading-none tracking-tight text-white">
            The Social Project
          </span>
        </Link>

        {!loading && (
          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/profile"
                  aria-label={
                    showUnreadProfileDot
                      ? "Profile — unread activity"
                      : "Profile"
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white/20"
                >
                  <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-300 text-[10px] font-bold text-brand-900">
                    {(user.email?.[0] ?? "?").toUpperCase()}
                    {showUnreadProfileDot && (
                      <span
                        className="pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ember shadow-[0_0_6px_2px_rgba(245,210,139,0.95),0_0_14px_5px_rgba(232,184,106,0.55)] ring-[1.5px] ring-brand-900"
                        aria-hidden
                      />
                    )}
                  </span>
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-full px-3 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-white/50 transition-colors duration-300 hover:text-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-700 transition-all duration-300 hover:bg-brand-50 hover:shadow-[0_10px_30px_-12px_rgba(0,32,15,0.5)]"
              >
                Sign in
                <svg
                  className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m-6-6 6 6-6 6"
                  />
                </svg>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
