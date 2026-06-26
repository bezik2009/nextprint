"use client";

import { useEffect, useState, useCallback } from "react";
import { NAV_ITEMS } from "@/lib/constants";

/* ─────────────────────────────────────────────────────────────────────────
   NavLinks
   Renders the navigation anchor list with:
   • smooth-scroll on click (prevents full page reload)
   • IntersectionObserver active-section highlighting
   Props:
     mobile  – when true, uses mobile font styles and calls onClose after click
     onClose – optional callback to collapse burger menu
─────────────────────────────────────────────────────────────────────────── */
interface NavLinksProps {
  mobile?: boolean;
  onClose?: () => void;
}

const SECTION_IDS = NAV_ITEMS.map((item) => item.href.replace("#", ""));

export function NavLinks({ mobile = false, onClose }: NavLinksProps) {
  const [activeId, setActiveId] = useState<string>("");

  /* ── IntersectionObserver: track which section is in view ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        {
          // Trigger when the section crosses the middle third of the viewport
          rootMargin: "-30% 0px -60% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Smooth scroll handler ── */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update URL hash without triggering a navigation
        history.pushState(null, "", href);
      }
      onClose?.();
    },
    [onClose]
  );

  if (mobile) {
    return (
      <>
        {NAV_ITEMS.map((item) => {
          const id = item.href.replace("#", "");
          const isActive = activeId === id;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              style={{
                color: isActive ? "#F5C400" : "#F4F7FA",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                opacity: isActive ? 1 : 0.85,
                transition: "color 0.2s",
              }}
            >
              {item.label}
            </a>
          );
        })}
      </>
    );
  }

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const id = item.href.replace("#", "");
        const isActive = activeId === id;
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className={`np-nav-link${isActive ? " np-nav-link--active" : ""}`}
          >
            {item.label}
          </a>
        );
      })}
    </>
  );
}
