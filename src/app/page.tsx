import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { CapabilitiesSection } from "@/components/CapabilitiesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { TrustBlock } from "@/components/TrustBlock";
import { FAQSection } from "@/components/FAQSection";
import { ContactsSection } from "@/components/ContactsSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <CapabilitiesSection />
        <ProcessSection />
        <PortfolioGallery />
        <TrustBlock />
        <FAQSection />
      </main>
      <ContactsSection />
    </>
  );
}
