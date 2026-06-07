"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "", description: "Hi", price: 499, badge: "NEW" }
];

const testimonials = [
  "The confidence boost is real. — Kavitha R., Chennai",
  "Simplicity that actually works. — Aryan S., Mumbai",
  "Worth every rupee. — Preethi N., Bangalore",
  "Changed my morning ritual entirely. — Rohan V., Delhi",
  "The confidence boost is real. — Kavitha R., Chennai",
  "Simplicity that actually works. — Aryan S., Mumbai",
  "Worth every rupee. — Preethi N., Bangalore",
  "Changed my morning ritual entirely. — Rohan V., Delhi",
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "done">("idle");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Inject marquee keyframe
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes marquee-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-track { animation: marquee-scroll 28s linear infinite; }
      .reveal { opacity: 1; transform: translateY(0); }
      .will-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease-out, transform 0.65s ease-out; }
      .will-reveal.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("will-reveal");
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: String(p.id), name: p.name || "Hi", price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubStatus("done");
    setEmail("");
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* ─── HERO: Asymmetric split — flush-left 'Hi.' + product bleeding right ─── */}
      <section
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr",
          paddingTop: "80px",
          position: "relative",
          background: "var(--bg)",
        }}
      >
        {/* Desktop: side-by-side via absolute positioning of image panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "55fr 45fr",
            minHeight: "calc(100vh - 80px)",
            alignItems: "stretch",
          }}
          className="hero-grid"
        >
          {/* Left: text column */}
          <div
            style={{
              padding: "clamp(48px, 8vw, 96px) clamp(24px, 5vw, 80px) clamp(48px, 8vw, 96px) clamp(24px, 6vw, 96px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              zIndex: 2,
              position: "relative",
            }}
          >
            {/* Eyebrow */}
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "24px",
                fontFamily: "var(--font-body)",
              }}
            >
              Own Every Room You Enter
            </p>

            {/* Giant 'Hi.' headline */}
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(6rem, 16vw, 13rem)",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "var(--primary)",
                margin: "0 0 24px 0",
                fontStyle: "italic",
              }}
            >
              Hi.
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                color: "var(--muted)",
                lineHeight: 1.65,
                maxWidth: "460px",
                marginBottom: "40px",
                fontFamily: "var(--font-body)",
              }}
            >
              The essentials that make you walk in like you own the place. Direct. Confident. Yours.
            </p>

            {/* Trust row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: "40px",
                fontSize: "0.8rem",
                color: "var(--muted)",
                fontFamily: "var(--font-body)",
                alignItems: "center",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" fill="var(--accent)" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                4.8 · 25,000+ happy customers
              </span>
              <span>Made in India</span>
              <span>Free delivery above ₹499</span>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/shop")}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  padding: "0 32px",
                  height: "56px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.01em",
                }}
              >
                Discover Products
              </button>
            </div>
          </div>

          {/* Right: product image bleeding off right edge */}
          <div
            style={{
              overflow: "hidden",
              position: "relative",
              background: "var(--surface)",
              minHeight: "480px",
            }}
          >
            <img
              src={products[0].img}
              alt="Hi product — the essential for everyday confidence"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
            {/* Subtle price label bottom-left */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                background: "var(--primary)",
                color: "var(--bg)",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.02em",
              }}
            >
              ₹{products[0].price.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Mobile override: stack vertically */}
        <style>{`
          @media (max-width: 767px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
              grid-template-rows: auto auto;
            }
          }
        `}</style>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section
        className="reveal"
        style={{
          background: "var(--primary)",
          padding: "28px clamp(24px, 5vw, 80px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "24px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {[
            ["25,000+", "Happy Customers"],
            ["100%", "Made in India"],
            ["4.8★", "Average Rating"],
            ["₹499+", "Free Delivery"],
          ].map(([num, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: "1 1 140px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "var(--accent)",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.02em",
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "var(--muted)",
                  marginTop: "4px",
                  fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── EDITORIAL STORY SPLIT ─── */}
      <section
        id="about"
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "var(--space-section) 0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            minHeight: "500px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Left: deep charcoal pullquote panel */}
          <div
            style={{
              background: "var(--primary)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(48px, 8vw, 96px) clamp(32px, 6vw, 72px)",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "24px",
                fontFamily: "var(--font-body)",
              }}
            >
              Our Story
            </p>
            <blockquote
              style={{
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                fontWeight: 400,
                lineHeight: 1.25,
                color: "var(--bg)",
                margin: "0 0 32px 0",
                letterSpacing: "-0.01em",
              }}
            >
              "Walk in. Own it. That's the whole philosophy."
            </blockquote>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.7,
                fontSize: "0.95rem",
                fontFamily: "var(--font-body)",
                maxWidth: "400px",
                marginBottom: "32px",
              }}
            >
              Hi was built for the urban Indian who doesn't need persuading — only the right tools. We make exactly what you need, nothing more.
            </p>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                background: "transparent",
                border: "2px solid var(--accent)",
                color: "var(--accent)",
                padding: "0 24px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "transform 0.15s ease",
                alignSelf: "flex-start",
                whiteSpace: "nowrap",
              }}
            >
              Read Our Story
            </button>
          </div>

          {/* Right: close-crop product texture */}
          <div style={{ overflow: "hidden", minHeight: "400px", position: "relative" }}>
            <img
              src={products[0].img}
              alt="Hi product close-up texture detail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 30%",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ─── BENTO FEATURE GRID ─── */}
      <section
        id="features"
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
              fontFamily: "var(--font-body)",
            }}
          >
            What Makes Hi, Hi
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--primary)",
              marginBottom: "40px",
              lineHeight: 1.1,
            }}
          >
            Built around you.
          </h2>

          {/* Bento grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "16px",
              gridAutoRows: "auto",
            }}
          >
            {/* Tile 1: tall left — product detail photo */}
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                gridRow: "span 2",
                minHeight: "460px",
                boxShadow: "var(--shadow-sm)",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(products[0].name || "Hi")}&price=${products[0].price}&img=${encodeURIComponent(products[0].img)}`)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <img
                src={products[0].img}
                alt="Hi product detail shot"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", transition: "transform 0.7s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(30,28,24,0.8))", padding: "32px 24px 24px" }}>
                <span style={{ color: "var(--bg)", fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "1.3rem" }}>The essential.</span>
              </div>
            </div>

            {/* Tile 2: top right */}
            <div
              style={{
                background: "var(--accent)",
                borderRadius: "var(--radius-lg)",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "220px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  fontWeight: 700,
                  color: "var(--bg)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                01.
              </span>
              <div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1.1rem", color: "var(--bg)", marginBottom: "8px" }}>
                  No fuss. All results.
                </h3>
                <p style={{ color: "rgba(245,240,232,0.75)", fontSize: "0.875rem", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
                  Stripped to what actually works. Zero noise.
                </p>
              </div>
            </div>

            {/* Tile 3: bottom right */}
            <div
              style={{
                background: "var(--primary)",
                borderRadius: "var(--radius-lg)",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "220px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  fontWeight: 700,
                  color: "var(--accent)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                02.
              </span>
              <div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1.1rem", color: "var(--bg)", marginBottom: "8px" }}>
                  Crafted in India.
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
                  Every unit made with intention, right here at home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE SOCIAL PROOF ─── */}
      <section
        className="reveal"
        style={{
          background: "var(--accent)",
          padding: "28px 0",
          overflow: "hidden",
        }}
      >
        <div
          className="marquee-track"
          style={{
            display: "flex",
            gap: "80px",
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          {testimonials.map((t, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontSize: "clamp(0.95rem, 2vw, 1.25rem)",
                color: "var(--bg)",
                letterSpacing: "0.01em",
                flexShrink: 0,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ─── BESTSELLER MOMENT: Editorial offset full-width ─── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "48px",
              alignItems: "center",
            }}
          >
            {/* Text side */}
            <div>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "16px",
                  fontFamily: "var(--font-body)",
                }}
              >
                Bestseller
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--primary)",
                  marginBottom: "20px",
                }}
              >
                {products[0].name || "Hi"}
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  marginBottom: "12px",
                  fontFamily: "var(--font-body)",
                  maxWidth: "400px",
                }}
              >
                {products[0].description}
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginBottom: "32px",
                  fontFamily: "var(--font-body)",
                }}
              >
                ₹{products[0].price.toLocaleString("en-IN")}
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => handleAddToCart(products[0])}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  style={{
                    background: addedId === products[0].id ? "var(--primary)" : "var(--accent)",
                    color: "#fff",
                    border: "none",
                    padding: "0 32px",
                    height: "56px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "transform 0.15s ease, background 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {addedId === products[0].id ? "✓ Added to Bag" : "Add to Bag"}
                </button>
                <button
                  onClick={() => router.push(`/product?name=${encodeURIComponent(products[0].name || "Hi")}&price=${products[0].price}&img=${encodeURIComponent(products[0].img)}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  style={{
                    background: "transparent",
                    border: "2px solid var(--primary)",
                    color: "var(--primary)",
                    padding: "0 24px",
                    height: "56px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "transform 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Product image with overlap breakout */}
            <div
              style={{
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(products[0].name || "Hi")}&price=${products[0].price}&img=${encodeURIComponent(products[0].img)}`)}
            >
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-md)",
                  marginTop: "-32px",
                  marginBottom: "32px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-xl)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLDivElement).style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <img
                  src={products[0].img}
                  alt="Hi bestseller product on warm surface"
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    transition: "transform 0.7s ease",
                    maxHeight: "500px",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BRAND MANIFESTO ─── */}
      <section
        className="reveal"
        style={{
          background: "#fff",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ width: "60px", height: "1px", background: "var(--muted)", margin: "0 auto 32px", opacity: 0.5 }} />
          <blockquote
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
              fontWeight: 400,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              color: "var(--primary)",
              margin: "0 0 32px 0",
            }}
          >
            "Every room you walk into — it should feel like you just raised the bar."
          </blockquote>
          <div style={{ width: "60px", height: "1px", background: "var(--muted)", margin: "0 auto", opacity: 0.5 }} />
          <p
            style={{
              marginTop: "24px",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Hi — India
          </p>
        </div>
      </section>

      {/* ─── FOOTER CTA: Stark split ─── */}
      <section
        className="reveal"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        }}
      >
        {/* Left: deep charcoal with serif headline + email */}
        <div
          style={{
            background: "var(--primary)",
            padding: "clamp(48px, 8vw, 96px) clamp(32px, 6vw, 72px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              color: "var(--bg)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Say hi back.
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.95rem",
              lineHeight: 1.65,
              marginBottom: "32px",
              fontFamily: "var(--font-body)",
              maxWidth: "360px",
            }}
          >
            New drops, first access, and the occasional reminder that you deserve the good stuff.
          </p>

          {subStatus === "done" ? (
            <p
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontSize: "1.2rem",
              }}
            >
              Thanks for saying hi. ✓
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{ display: "flex", gap: "0", maxWidth: "420px" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  height: "52px",
                  padding: "0 16px",
                  background: "transparent",
                  border: "1px solid rgba(140,136,128,0.5)",
                  borderRight: "none",
                  borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
                  color: "var(--bg)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                disabled={subStatus === "loading"}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                style={{
                  height: "52px",
                  padding: "0 24px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {subStatus === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>

        {/* Right: accent colour panel — completely flat */}
        <div
          style={{
            background: "var(--accent)",
            padding: "clamp(48px, 8vw, 96px) clamp(32px, 6vw, 72px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.7)",
              marginBottom: "16px",
            }}
          >
            Ready to walk in?
          </p>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 700,
              color: "var(--bg)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "32px",
            }}
          >
            Everything you need. Nothing you don't.
          </h3>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              background: "var(--bg)",
              color: "var(--accent)",
              border: "none",
              padding: "0 32px",
              height: "56px",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "transform 0.15s ease",
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
            }}
          >
            Shop Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}