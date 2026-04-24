import Link from "next/link";

const footerLinks = {
  Explore: [
    { href: "/community", label: "The Campfire" },
    { href: "/merch", label: "The Gift Shop" },
  ],
  Company: [
    { href: "mailto:jackatlancer@gmail.com", label: "Contact" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms" },
  ],
  Connect: [
    { href: "https://instagram.com/thesocialproject_official", label: "Instagram" },
    { href: "https://tiktok.com/@jointhesocialproject", label: "TikTok" },
    // { href: "#", label: "Newsletter" }, // hidden with the rest of the newsletter — restore here
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ember/10 bg-gradient-to-b from-[#06160d] to-[#04130a] pt-24 pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/20 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-50/25 transition-colors group-hover:border-brand-200">
                <span className="absolute inset-1 rounded-full bg-brand-200/85" />
                <span className="absolute inset-[10px] rounded-full bg-brand-700" />
              </span>
              <span className="font-display text-xl tracking-tight text-brand-50">
                The Social Project
              </span>
            </Link>
            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-brand-50/70">
              Igniting human connection, inspiring authenticity. A community for
              people who want to live more connected, more real lives.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid gap-12 sm:grid-cols-3 lg:col-span-7">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-200">
                  {heading}
                </h3>
                <ul className="mt-6 space-y-3">
                  {links.map((link) => {
                    const isExternal = link.href.startsWith("http");
                    const className =
                      "group inline-flex items-center gap-2 text-sm text-brand-50/70 transition-colors duration-300 hover:text-brand-200";
                    return (
                      <li key={link.label}>
                        {isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={className}
                          >
                            <span className="link-rule" />
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className={className}>
                            <span className="link-rule" />
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized wordmark for editorial weight */}
        <div className="mt-24 hidden border-t border-brand-50/10 pt-12 md:block">
          <p
            aria-hidden
            className="font-display select-none text-[clamp(4rem,14vw,12rem)] leading-[0.85] tracking-[-0.03em] text-brand-50/[0.06]"
          >
            The Social Project
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brand-50/10 pt-8 text-[10px] font-medium uppercase tracking-[0.24em] text-brand-50/45 sm:flex-row md:mt-12">
          <span>&copy; {new Date().getFullYear()} The Social Project</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
