import { ContactSection } from "./sections/ContactSection";
import { HeroSection } from "./sections/HeroSection";
import { HobbySection } from "./sections/HobbySection";
import { MapPhotoSection } from "./sections/MapPhotoSection";
import { NotesCarousel } from "./sections/NotesCarousel";
import { PortfolioSection } from "./sections/PortfolioSection";
import { ScrollProgressBar } from "./sections/ScrollProgressBar";

export function HomePageLayout() {
  return (
    <main className="min-h-screen bg-white text-[#101319]">
      <ScrollProgressBar />
      <div className="flex flex-col">
        <HeroSection />
        <PortfolioSection />
        <NotesCarousel />
        <MapPhotoSection />
        <HobbySection />
        <ContactSection />
      </div>
    </main>
  );
}
