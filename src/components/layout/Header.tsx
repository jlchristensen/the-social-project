"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/community", label: "The Campfire" },
  { href: "/resources", label: "Resources" },
  { href: "/merch", label: "Merch" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-[background-color,backdrop-filter,border-color,padding,box-shadow] duration-700 ease-out ${
        scrolled
          ? "border-b border-white/10 bg-brand-900/85 py-3 shadow-[0_8px_30px_-15px_rgba(0,32,15,0.6)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 transition-colors duration-500 group-hover:border-brand-200">
            <span className="absolute inset-1 rounded-full bg-brand-200/85 transition-transform duration-500 group-hover:scale-90" />
            <span className="absolute inset-[10px] rounded-full bg-brand-700" />
          </span>
          <span className="font-display text-lg leading-none tracking-tight text-white">
            The Social Project
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.16em] text-white/65 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {!loading && (
            <>
              {user ? (
                <div className="ml-3 flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white/20"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-300 text-[10px] font-bold text-brand-900">
                      {(user.email?.[0] ?? "?").toUpperCase()}
                    </span>
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="rounded-full px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="group ml-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-700 transition-all duration-300 hover:bg-brand-50 hover:shadow-[0_10px_30px_-12px_rgba(0,32,15,0.5)]"
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
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-white/10 bg-brand-900/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                      className="mt-3 rounded-full border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-brand-700"
                  >
                    Sign in
                  </Link>
                )}
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
