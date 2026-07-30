import Link from "next/link";

/**
 * One quiet row at the bottom of the night. The Gift Shop lives here now —
 * the site itself is the Campfire.
 */
const links = [
  { href: "/merch", label: "The Gift Shop" },
  { href: "mailto:jackatlancer@gmail.com", label: "Contact" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  {
    href: "https://instagram.com/thesocialproject_official",
    label: "Instagram",
  },
  { href: "https://tiktok.com/@jointhesocialproject", label: "TikTok" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ember/10 bg-gradient-to-b from-[#06160d] to-[#04130a] pt-14 pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/20 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-50/25 transition-colors group-hover:border-brand-200">
              <span className="absolute inset-1 rounded-full bg-brand-200/85" />
              <span className="absolute inset-[9px] rounded-full bg-brand-700" />
            </span>
            <span className="font-display text-lg tracking-tight text-brand-50">
              The Social Project
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {links.map((link) => {
              const isExternal = link.href.startsWith("http");
              const className =
                "text-sm text-brand-50/60 transition-colors duration-300 hover:text-brand-200";
              return isExternal ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className={className}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-brand-50/10 pt-8 text-[10px] font-medium uppercase tracking-[0.24em] text-brand-50/45 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} The Social Project</span>
          <span>One question, every night</span>
        </div>
      </div>
    </footer>
  );
}
