"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Wraps the app in the shared site chrome (header + footer).
 *
 * Design-preview routes under /preview/* opt out entirely so they can ship
 * their own header and footer — the whole point of a preview is to show a
 * complete direction, chrome included. Delete this escape hatch once a
 * direction has been chosen and rolled out.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/preview")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
