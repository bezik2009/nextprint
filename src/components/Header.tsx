"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { MobileNav } from "@/components/MobileNav";
import { NavLinks } from "@/components/NavLinks";

/* Smooth-scroll helper used by logo and CTA button */
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id === "hero" ? "/" : `#${id}`);
  } else if (id === "hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.pushState(null, "", "/");
  }
}

export function Header() {
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo("hero");
  }, []);

  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo("contacts");
  }, []);

  return (
    <header className="np-header">

      {/* Zone 1 — Logo → scroll to top */}
      <Link
        href="/"
        onClick={handleLogoClick}
        className="np-header-logo"
        aria-label="NEXT PRINT — до початку сторінки"
      >
        <Image
          src="/logo.png"
          alt="NEXT PRINT"
          height={56}
          width={210}
          style={{ height: 56, width: "auto" }}
          priority
        />
      </Link>

      {/* Zone 2 — Spacer */}
      <div className="np-header-spacer" aria-hidden="true" />

      {/* Zone 3 — Nav (client: active highlighting + smooth scroll) */}
      <nav className="np-header-nav" aria-label="Головна навігація">
        <NavLinks />
      </nav>

      {/* Zone 4 — CTA → scroll to #contacts */}
      <a
        href="#contacts"
        onClick={handleContactClick}
        className="np-btn-contact"
      >
        Звʼязатися
      </a>

      {/* Mobile burger */}
      <MobileNav />
    </header>
  );
}
