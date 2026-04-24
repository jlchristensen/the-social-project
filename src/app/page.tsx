import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import MissionSection from "@/components/sections/MissionSection";
import CampfireSection from "@/components/sections/CampfireSection";
// import CTASection from "@/components/sections/CTASection"; // newsletter — hidden, restore by uncommenting here and below

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CampfireSection />
      <MissionSection />
      {/* <CTASection /> */}
    </>
  );
}
