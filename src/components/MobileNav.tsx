"use client";

import { useState, useCallback } from "react";
import { NavLinks } from "@/components/NavLinks";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    close();
    const el = document.getElementById("contacts");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#contacts");
    }
  }, [close]);

  return (
    <>
      {/* Burger button */}
      <button
        className="np-burger"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={open}
      >
        <span style={{ transform: open ? "translateY(7px) rotate(45deg)" : undefined }} />
        <span style={{ opacity: open ? 0 : undefined }} />
        <span style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : undefined }} />
      </button>

      {/* Mobile nav overlay */}
      {open && (
        <div
          role="navigation"
          aria-label="Мобільна навігація"
          style={{
            position: "fixed",
            top: 64, left: 0, right: 0,
            background: "rgba(3,20,38,0.97)",
            backdropFilter: "blur(16px)",
            padding: "32px 24px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            zIndex: 99,
            borderBottom: "1px solid rgba(244,247,250,0.12)",
          }}
        >
          <NavLinks mobile onClose={close} />

          {/* CTA → #contacts */}
          <a
            href="#contacts"
            onClick={handleContactClick}
            className="np-btn-contact"
            style={{ alignSelf: "flex-start" }}
          >
            Звʼязатися
          </a>
        </div>
      )}
    </>
  );
}
