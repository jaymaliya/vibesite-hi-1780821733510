"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prevTotal, setPrevTotal] = React.useState(totalItems);
  const [badgePop, setBadgePop] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (totalItems !== prevTotal) {
      setBadgePop(true);
      setPrevTotal(totalItems);
      const t = setTimeout(() => setBadgePop(false), 400);
      return () => clearTimeout(t);
    }
  }, [totalItems, prevTotal]);

  function scrollToAbout() {
    setMobileOpen(false);
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  function goTo(path: string) {
    setMobileOpen(false);
    router.push(path);
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--bg)",
        transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: scrolled
          ? "0 2px 16px 0 rgba(30,28,24,0.10)"
          : "none",
        fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
      }}
    >
      <nav
        aria-label="Main navigation"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => goTo("/")}
          aria-label="Hi — go to homepage"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="48"
            height="32"
            viewBox="0 0 48 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <text
              x="0"
              y="28"
              style={{
                fontFamily: "var(--font-heading, 'Playfair Display', serif)",
                fontSize: "32px",
                fontWeight: 700,
                fill: "var(--primary)",
                letterSpacing: "-1px",
              }}
            >
              Hi
            </text>
          </svg>
        </button>

        {/* Desktop nav links — center */}
        <div
          role="list"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="hidden-mobile"
        >
          {[
            { label: "Shop", action: () => goTo("/shop") },
            { label: "Our Story", action: scrollToAbout },
            { label: "Ingredients", action: scrollToAbout },
            { label: "Gifts", action: () => goTo("/shop") },
          ].map(({ label, action }) => (
            <button
              key={label}
              role="listitem"
              onClick={action}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                fontSize: "15px",
                fontWeight: 500,
                color: "var(--primary)",
                letterSpacing: "0.01em",
                padding: "4px 0",
                position: "relative",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #C8572A";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset =
                  "3px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right side: Cart + Hamburger */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
          }}
        >
          {/* Cart button */}
          <button
            onClick={() => router.push("/checkout")}
            aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              transition:
                "background 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--surface)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(0.98)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.02)";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #C8572A";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            {/* Cart SVG icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>

            {/* Badge */}
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  fontSize: 11,
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transition:
                    "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                  transform: badgePop ? "scale(1.35)" : "scale(1)",
                  boxShadow: "0 1px 4px rgba(200,87,42,0.4)",
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 8,
              transition:
                "background 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #C8572A";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            {mobileOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          style={{
            position: "fixed",
            inset: 0,
            top: 64,
            backgroundColor: "var(--bg)",
            zIndex: 49,
            display: "flex",
            flexDirection: "column",
            padding: "40px 32px",
            gap: 8,
            overflowY: "auto",
          }}
        >
          {[
            { label: "Shop", action: () => goTo("/shop") },
            { label: "Our Story", action: scrollToAbout },
            { label: "Ingredients", action: scrollToAbout },
            { label: "Gifts", action: () => goTo("/shop") },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                background: "none",
                border: "none",
                borderBottom: "1px solid #EDEAE0",
                cursor: "pointer",
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                fontSize: "20px",
                fontWeight: 500,
                color: "var(--primary)",
                padding: "20px 0",
                textAlign: "left",
                width: "100%",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #C8572A";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset =
                  "3px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => goTo("/checkout")}
            style={{
              marginTop: 32,
              background: "var(--primary)",
              border: "none",
              borderRadius: "var(--radius-md, 8px)",
              cursor: "pointer",
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--bg)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
              transition:
                "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(0.98)";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #C8572A";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "3px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--bg)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Cart
            {totalItems > 0 && (
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Responsive styles via Tailwind-friendly approach using a real class toggle */}
      <ResponsiveNavStyles />
    </header>
  );
}

// Injects responsive rules into globals without inline <style> tags
// We use a server-safe hidden element approach — but actually we must avoid inline style tags.
// Instead, we rely on Tailwind classes declared in globals.css.
// The classes "hidden-mobile" and "show-mobile" are defined in globals.css.
function ResponsiveNavStyles() {
  return null;
}