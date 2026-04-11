import { NotesCarousel } from "./sections/NotesCarousel";
import { ObsidianFocusSection } from "./sections/ObsidianFocusSection";
import { PortfolioSection } from "./sections/PortfolioSection";
import { ScrollProgressBar } from "./sections/ScrollProgressBar";
import { HeroSection } from "./sections/HeroSection";
import { WavesDemo } from "@/components/ui/demo";

export function HomePageLayout() {
  return (
    <main className="min-h-screen bg-white text-[#101319]">
      <ScrollProgressBar />
      <div className="flex flex-col">
        <HeroSection />
        <PortfolioSection />
        <ObsidianFocusSection />
        <NotesCarousel />
        <WavesDemo />
      </div>
    </main>
  );
}
