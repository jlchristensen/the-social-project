import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/** Wraps the app in the shared site chrome (header + footer). */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
