import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { CapabilitiesSection } from "@/components/CapabilitiesSection";
import { ProcessSection } from "@/components/ProcessSection";
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
      </main>
      <ContactsSection />
    </>
  );
}
