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
  const railRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes marquee-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-track { animation: marquee-scroll 28s linear infinite; }
      .will-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease-out, transform 0.65s ease-out; }
      .will-reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal {}
      @media (max-width: 767px) {
        .hero-grid {
          display: flex !important;
          flex-direction: column !important;
        }
        .hero-img-panel {
          order: -1 !important;
          height: 45vh !important;
          min-height: 45vh !important;
          width: 100% !important;
        }
        .hero-text-panel {
          min-height: unset !important;
        }
        .story-grid {
          grid-template-columns: 1fr !important;
        }
        .bento-grid {
          grid-template-columns: 1fr 1fr !important;
          grid-template-rows: auto auto auto !important;
        }
        .bento-cell-main {
          grid-column: span 2 !important;
          grid-row: span 1 !important;
          min-height: 240px !important;
        }
        .newsletter-grid {
          grid-template-columns: 1fr !important;
        }
      }
      @media (max-width: 480px) {
        .bento-grid {
          grid-template-columns: 1fr !important;
        }
        .bento-cell-main {
          grid-column: span 1 !important;
        }
      }
      .rail-hide-scrollbar::-webkit-scrollbar { display: none; }
      .rail-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .card-lift { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1); }
      .card-lift:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
    `;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

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

  const handleRailScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setScrollProgress(max > 0 ? rail.scrollLeft / max : 0);
  };

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

  const crowdFavourites = [
    { id: 1, img: "/product-1.jpg", name: "The Daily Essential", price: 499, badge: "Bestseller" },
    { id: 1, img: "/product-1.jpg", name: "Morning Ritual Kit", price: 899, badge: "Top Rated" },
    { id: 1, img: "/product-1.jpg", name: "Statement Piece", price: 699, badge: "Popular" },
    { id: 1, img: "/product-1.jpg", name: "The Full Set", price: 1299, badge: "Value" },
    { id: 1, img: "/product-1.jpg", name: "Pocket Confidence", price: 349, badge: "NEW" },
  ];

  const bentoItems = [
    { label: "25,000+ customers trust Hi daily", sub: "Real people. Real rooms. Real confidence.", isText: false },
    { stat: "100%", label: "Made in India", sub: "Every product, every time.", isText: true },
    { stat: "4.8★", label: "Average Rating", sub: "From 3,200+ verified buyers.", isText: true },
  ];

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO — SPLIT_TEXT_LEFT, cream left / warm-white image right
      ══════════════════════════════════════════ */}
      <section
        style={{
          paddingTop: "80px",
          position: "relative",
          minHeight: "100vh",
          background: "var(--primary)",
        }}
      >
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "55fr 45fr",
            minHeight: "calc(100vh - 80px)",
            alignItems: "stretch",
          }}
        >
          {/* LEFT: cream text column */}
          <div
            className="hero-text-panel"
            style={{
              padding:
                "clamp(48px, 8vw, 96px) clamp(24px, 5vw, 72px) clamp(48px, 8vw, 96px) clamp(24px, 6vw, 96px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "var(--primary)",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "28px",
                fontFamily: "var(--font-body)",
              }}
            >
              Own Every Room You Enter
            </p>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(4rem, 9vw, 7.5rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "var(--bg)",
                margin: "0 0 8px 0",
              }}
            >
              Elevate
            </h1>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(4rem, 9vw, 7.5rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "var(--bg)",
                margin: "0 0 32px 0",
              }}
            >
              Your Every Day.
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                color: "var(--bg)",
                lineHeight: 1.7,
                maxWidth: "440px",
                marginBottom: "16px",
                fontFamily: "var(--font-body)",
                opacity: 0.72,
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
                color: "var(--bg)",
                fontFamily: "var(--font-body)",
                alignItems: "center",
                opacity: 0.65,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="13" height="13" fill="var(--accent)" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                4.8 · 25,000+ happy customers
              </span>
              <span>Made in India</span>
              <span>Free delivery above ₹499</span>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/shop")}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  background: "var(--bg)",
                  color: "var(--primary)",
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
                  boxShadow: "var(--shadow-md)",
                }}
              >
                Discover Products
              </button>
              <button
                onClick={() =>
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                style={{
                  background: "transparent",
                  color: "var(--bg)",
                  border: "1.5px solid var(--bg)",
                  padding: "0 28px",
                  height: "56px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                  opacity: 0.7,
                }}
              >
                Our Story
              </button>
            </div>
          </div>

          {/* RIGHT: product image — warm surface background, bleeds to edge */}
          <div
            className="hero-img-panel"
            style={{
              overflow: "hidden",
              position: "relative",
              background: "#F7F2EA",
              borderRadius: 0,
              minHeight: "560px",
            }}
          >
            <img
              src={products[0].img}
              alt="Hi — everyday essential product shot"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
            {/* Price badge */}
            <div
              style={{
                position: "absolute",
                bottom: "28px",
                left: "28px",
                background: "var(--bg)",
                color: "var(--primary)",
                padding: "10px 18px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.02em",
                boxShadow: "var(--shadow-md)",
              }}
            >
              From ₹{products[0].price.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP — dark band with clear numeral/label hierarchy
      ══════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "40px clamp(24px, 5vw, 80px)",
          borderTop: "1px solid rgba(196,168,130,0.12)",
          borderBottom: "1px solid rgba(196,168,130,0.12)",
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
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 600,
                  color: "var(--accent)",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--muted)",
                  marginTop: "8px",
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

      {/* ══════════════════════════════════════════
          STORY SPLIT — ASYMMETRIC_SPLIT, cream bg / dark right panel
          Background is cream (var(--primary)) not dark — breaks the band rhythm
      ══════════════════════════════════════════ */}
      <section
        id="about"
        className="reveal"
        style={{
          background: "var(--primary)",
          padding: "0",
          overflow: "hidden",
        }}
      >
        <div
          className="story-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "60fr 40fr",
            minHeight: "520px",
            maxWidth: "100%",
          }}
        >
          {/* Left: cream text panel */}
          <div
            style={{
              background: "var(--primary)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(48px, 8vw, 96px) clamp(32px, 6vw, 80px)",
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
                lineHeight: 1.2,
                color: "var(--bg)",
                margin: "0 0 28px 0",
                letterSpacing: "-0.01em",
              }}
            >
              "Walk in. Own it.
              <br />
              That's the whole philosophy."
            </blockquote>
            <p
              style={{
                color: "var(--bg)",
                lineHeight: 1.75,
                fontSize: "0.95rem",
                fontFamily: "var(--font-body)",
                maxWidth: "400px",
                marginBottom: "36px",
                opacity: 0.7,
              }}
            >
              Hi was built for the urban Indian who doesn't need persuading — only the right tools.
              We make exactly what you need, nothing more.
            </p>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                background: "var(--bg)",
                color: "var(--primary)",
                border: "none",
                padding: "0 28px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "transform 0.15s ease",
                alignSelf: "flex-start",
                letterSpacing: "0.01em",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Shop the Collection
            </button>
          </div>

          {/* Right: dark product panel */}
          <div
            style={{
              background: "var(--bg)",
              position: "relative",
              overflow: "hidden",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={products[0].img}
              alt="Hi product detail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                opacity: 0.9,
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(14,12,20,0.3) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BENTO MOSAIC — 'Built Around You'
          CSS grid: 2fr 1fr 1fr / rows 1fr 1fr, main cell spans 2 rows
      ══════════════════════════════════════════ */}
      <section
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
            Built Around You
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "40px",
              lineHeight: 1.1,
            }}
          >
            Everything you need.
            <br />
            Nothing you don't.
          </h2>

          <div
            className="bento-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gridTemplateRows: "260px 260px",
              gap: "12px",
            }}
          >
            {/* Main cell — spans 2 rows */}
            <div
              className="bento-cell-main card-lift"
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(products[0].name || "Hi")}&price=${products[0].price}&img=${encodeURIComponent(products[0].img)}`
                )
              }
              style={{
                gridColumn: "1",
                gridRow: "span 2",
                overflow: "hidden",
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                position: "relative",
                cursor: "pointer",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <img
                src={products[0].img}
                alt="Hi hero product"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
                }
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(14,12,20,0.8) 0%, transparent 60%)",
                  padding: "32px 28px 24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.5rem",
                    fontStyle: "italic",
                    color: "var(--primary)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  The Daily Essential
                </p>
                <p
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    marginTop: "8px",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  ₹{products[0].price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Card 02 — top right */}
            <div
              className="card-lift"
              style={{
                gridColumn: "2 / span 2",
                gridRow: "1",
                background: "var(--primary)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "clamp(24px, 4vw, 40px)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)",
                  fontWeight: 700,
                  color: "var(--accent)",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                25,000+
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "var(--bg)",
                  marginTop: "10px",
                  opacity: 0.65,
                }}
              >
                Customers who own every room
              </p>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  color: "var(--bg)",
                  marginTop: "12px",
                  opacity: 0.55,
                  lineHeight: 1.4,
                }}
              >
                Real people. Real rooms. Real confidence.
              </p>
            </div>

            {/* Card 03 — bottom right */}
            <div
              className="card-lift"
              style={{
                gridColumn: "2 / span 2",
                gridRow: "2",
                background: "var(--bg)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "clamp(24px, 4vw, 40px)",
                border: "1px solid rgba(196,168,130,0.18)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                <div>
                  <span
                    style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                      fontWeight: 600,
                      color: "var(--text)",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    4.8★
                  </span>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "var(--muted)",
                      marginTop: "6px",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Average Rating
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                      fontWeight: 600,
                      color: "var(--text)",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    100%
                  </span>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "var(--muted)",
                      marginTop: "6px",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Made in India
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  marginTop: "20px",
                  lineHeight: 1.6,
                  maxWidth: "320px",
                }}
              >
                Crafted with intent. Tested by the urban Indian who demands the best, every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CROWD FAVOURITES — HORIZONTAL_RAIL
          scroll-snap, 280px min cards, peek ~40px, accent scroll progress pill
      ══════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "var(--primary)",
          padding: "var(--space-section) 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            paddingLeft: "clamp(24px, 5vw, 80px)",
            paddingRight: "clamp(24px, 5vw, 80px)",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "12px",
              fontFamily: "var(--font-body)",
            }}
          >
            Crowd Favourites
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--bg)",
              lineHeight: 1.1,
            }}
          >
            What everyone's reaching for.
          </h2>
        </div>

        {/* Horizontal Rail */}
        <div
          ref={railRef}
          onScroll={handleRailScroll}
          className="rail-hide-scrollbar"
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: "clamp(24px, 5vw, 80px)",
            paddingRight: "clamp(24px, 5vw, 80px)",
            paddingBottom: "8px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {crowdFavourites.map((p, i) => (
            <article
              key={i}
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                )
              }
              className="card-lift"
              style={{
                flex: "0 0 auto",
                width: "clamp(240px, 28vw, 300px)",
                scrollSnapAlign: "start",
                cursor: "pointer",
                background: "var(--bg)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div style={{ overflow: "hidden", position: "relative" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
                  }
                />
                {p.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "var(--accent)",
                      color: "var(--bg)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-pill)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>
              <div style={{ padding: "20px 20px 24px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    margin: "0 0 6px",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-body)",
                    margin: 0,
                  }}
                >
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
              </div>
            </article>
          ))}
          {/* Peek spacer */}
          <div style={{ flex: "0 0 40px" }} />
        </div>

        {/* Scroll progress pill */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "20px auto 0",
            paddingLeft: "clamp(24px, 5vw, 80px)",
            paddingRight: "clamp(24px, 5vw, 80px)",
          }}
        >
          <div
            style={{
              height: "2px",
              background: "rgba(168,137,106,0.25)",
              borderRadius: "var(--radius-pill)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${scrollProgress * 100}%`,
                background: "var(--accent)",
                borderRadius: "var(--radius-pill)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIAL MARQUEE — dark band
      ══════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "40px 0",
          overflow: "hidden",
          borderTop: "1px solid rgba(196,168,130,0.1)",
          borderBottom: "1px solid rgba(196,168,130,0.1)",
        }}
      >
        <div className="marquee-track" style={{ display: "flex", whiteSpace: "nowrap", gap: "64px" }}>
          {[...testimonials, ...testimonials].map((t, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.875rem",
                color: "var(--muted)",
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                flexShrink: 0,
                letterSpacing: "0.01em",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER — two-panel split (dark left / accent right)
          Differentiated serif/sans typography between panels
      ══════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "0",
          overflow: "hidden",
        }}
      >
        <div
          className="newsletter-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "480px",
          }}
        >
          {/* LEFT: dark panel — flat sans, large */}
          <div
            style={{
              background: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(48px, 7vw, 88px) clamp(32px, 5vw, 72px)",
              borderRight: "1px solid rgba(196,168,130,0.12)",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "20px",
                fontFamily: "var(--font-body)",
              }}
            >
              Stay in the loop
            </p>
            <h2
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                lineHeight: 1.1,
                margin: "0 0 24px",
              }}
            >
              Say hi back.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "var(--muted)",
                lineHeight: 1.7,
                maxWidth: "360px",
                marginBottom: "36px",
              }}
            >
              New drops, restocks, and insider access. No spam — just the good stuff, when it matters.
            </p>
            {subStatus === "done" ? (
              <p
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                ✓ You're in. We'll be in touch.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{ display: "flex", gap: "12px", flexWrap: "wrap", maxWidth: "400px" }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: "1 1 200px",
                    padding: "0 16px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid rgba(196,168,130,0.3)",
                    background: "rgba(196,168,130,0.06)",
                    color: "var(--text)",
                    fontSize: "0.9rem",
                    fontFamily: "var(--font-body)",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={subStatus === "loading"}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg)",
                    border: "none",
                    padding: "0 24px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "transform 0.15s ease",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                  }}
                >
                  {subStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: accent panel — italic serif */}
          <div
            style={{
              background: "var(--accent)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(48px, 7vw, 88px) clamp(32px, 5vw, 72px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 400,
                color: "var(--bg)",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
                margin: "0 0 28px",
                maxWidth: "340px",
              }}
            >
              "Everything you need.
              <br />
              Nothing you don't."
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--bg)",
                lineHeight: 1.7,
                maxWidth: "300px",
                opacity: 0.7,
                marginBottom: "32px",
              }}
            >
              Join 25,000+ who've already found their daily essential. Free delivery on orders above ₹499.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                fontSize: "0.8rem",
                color: "var(--bg)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                opacity: 0.75,
              }}
            >
              <span>✓ No spam, ever</span>
              <span>✓ Early access to drops</span>
              <span>✓ Exclusive offers</span>
            </div>
            {/* Decorative large italic initial */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: "-20px",
                bottom: "-40px",
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontSize: "clamp(8rem, 16vw, 14rem)",
                fontWeight: 700,
                color: "rgba(14,12,20,0.08)",
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              Hi.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}