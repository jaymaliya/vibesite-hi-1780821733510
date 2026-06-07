"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer
      style={{
        backgroundColor: "var(--bg)",
        borderTop: "1px solid #EDEAE0",
        fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 32px 48px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: 48,
        }}
      >
        {/* Brand column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button
            onClick={() => router.push("/")}
            aria-label="Hi — go to homepage"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textAlign: "left",
              width: "fit-content",
            }}
          >
            <span
              style={{
                fontFamily:
                  "var(--font-heading, 'Playfair Display', serif)",
                fontSize: 36,
                fontWeight: 700,
                color: "var(--primary)",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              Hi
            </span>
          </button>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              lineHeight: 1.7,
              maxWidth: 240,
              margin: 0,
            }}
          >
            Own Every Room You Enter.
            <br />
            Crafted in India, for those who know what they want.
          </p>

          {/* Social icons */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}
          >
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hi on Instagram"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 8,
                color: "var(--primary)",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline =
                  "2px solid #C8572A";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset =
                  "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hi on Twitter"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 8,
                color: "var(--primary)",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline =
                  "2px solid #C8572A";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset =
                  "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/917000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Hi on WhatsApp"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 8,
                color: "var(--primary)",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline =
                  "2px solid #C8572A";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset =
                  "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3
            style={{
              fontFamily:
                "var(--font-heading, 'Playfair Display', serif)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--primary)",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Quick Links
          </h3>
          <nav aria-label="Footer quick links">
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                { label: "Home", path: "/" },
                { label: "Shop", path: "/shop" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => router.push(path)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily:
                        "var(--font-body, 'DM Sans', sans-serif)",
                      fontSize: 14,
                      color: "var(--muted)",
                      padding: 0,
                      textAlign: "left",
                      transition:
                        "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--muted)";
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--accent)";
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "2px solid #C8572A";
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.outlineOffset = "3px";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--muted)";
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "none";
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3
            style={{
              fontFamily:
                "var(--font-heading, 'Playfair Display', serif)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--primary)",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Contact Us
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              We love hearing from you.
              <br />
              Reach out anytime — we respond within 24 hours.
            </p>
            <a
              href="mailto:maliyajay77@gmail.com"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--accent)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition:
                  "opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline =
                  "2px solid #C8572A";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset =
                  "3px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              maliyajay77@gmail.com
            </a>

            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Made in India
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3
            style={{
              fontFamily:
                "var(--font-heading, 'Playfair Display', serif)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--primary)",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Stay in the Loop
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            New drops, exclusive offers, and stories worth reading. No spam.
          </p>

          {status === "success" ? (
            <div
              role="status"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--primary)",
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-md, 8px)",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Thanks! We'll be in touch.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              noValidate
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <label
                htmlFor="footer-email"
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  fontFamily:
                    "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize: 14,
                  color: "var(--primary)",
                  backgroundColor: "var(--bg)",
                  border: "1.5px solid #EDEAE0",
                  borderRadius: "var(--radius-md, 8px)",
                  padding: "12px 14px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  transition:
                    "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor =
                    "var(--accent)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor =
                    "var(--surface)";
                }}
              />
              {status === "error" && (
                <p
                  role="alert"
                  style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    margin: "2px 0 0",
                  }}
                >
                  Something went wrong. Please try again.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  fontFamily:
                    "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--bg)",
                  backgroundColor:
                    status === "loading" ? "var(--muted)" : "var(--primary)",
                  border: "none",
                  borderRadius: "var(--radius-md, 8px)",
                  padding: "13px 20px",
                  cursor:
                    status === "loading" ? "not-allowed" : "pointer",
                  transition:
                    "transform 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  marginTop: 4,
                }}
                onMouseEnter={(e) => {
                  if (status !== "loading") {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
                onMouseDown={(e) => {
                  if (status !== "loading") {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.transform = "scale(0.98)";
                  }
                }}
                onMouseUp={(e) => {
                  if (status !== "loading") {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.transform = "scale(1.02)";
                  }
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline =
                    "2px solid #C8572A";
                  (
                    e.currentTarget as HTMLButtonElement
                  ).style.outlineOffset = "3px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline =
                    "none";
                }}
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid #EDEAE0",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "24px 32px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            margin: 0,
          }}
        >
          &copy; {new Date().getFullYear()} Hi. All rights reserved.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span
            style={{
              fontSize: 13,
              color: "var(--muted)",
            }}
          >
            Secure checkout &middot; UPI &middot; Made in India
          </span>
        </div>
      </div>
    </footer>
  );
}