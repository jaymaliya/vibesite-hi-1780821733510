"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Hi Classic Tee", description: "Hi", price: 499, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Hi Polo Shirt", description: "Hi", price: 799, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Hi Cotton Cap", description: "Hi", price: 349, badge: "SALE" },
  { id: 4, img: "/product-4.jpg", name: "Hi Crew Socks", description: "Hi", price: 199, badge: "" }
];

const categories = [
  { label: "All", img: "/product-1.jpg" },
  { label: "Tops", img: "/product-2.jpg" },
  { label: "Accessories", img: "/product-3.jpg" },
  { label: "Essentials", img: "/product-4.jpg" },
  { label: "New In", img: "/product-1.jpg" },
  { label: "Sale", img: "/product-3.jpg" },
];

const crowdFavourites = [
  { id: 1, img: "/product-1.jpg", name: "Hi Classic Tee", price: 499 },
  { id: 2, img: "/product-2.jpg", name: "Hi Polo Shirt", price: 799 },
  { id: 3, img: "/product-3.jpg", name: "Hi Cotton Cap", price: 349 },
  { id: 4, img: "/product-4.jpg", name: "Hi Crew Socks", price: 199 },
];

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };

  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [addedCrowdIds, setAddedCrowdIds] = useState<Record<number, boolean>>({});
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const catRailRef = useRef<HTMLDivElement>(null);
  const crowdRailRef = useRef<HTMLDivElement>(null);
  const [catDragging, setCatDragging] = useState(false);
  const [catDragStart, setCatDragStart] = useState(0);
  const [catScrollStart, setCatScrollStart] = useState(0);
  const [crowdDragging, setCrowdDragging] = useState(false);
  const [crowdDragStart, setCrowdDragStart] = useState(0);
  const [crowdScrollStart, setCrowdScrollStart] = useState(0);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease-out, transform 0.65s ease-out; }
      .will-reveal.visible { opacity: 1; transform: translateY(0); }
      .rail-scroll::-webkit-scrollbar { display: none; }
      .rail-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .marquee-track { animation: marquee-left 28s linear infinite; }
      .cat-tile:hover .cat-img { transform: scale(1.06); }
      .product-card:hover .quick-overlay { opacity: 1; }
      @media (max-width: 768px) {
        .hero-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
        .hero-right { min-height: 56vw !important; }
        .hero-left { padding-top: 100px !important; padding-bottom: 40px !important; }
        .product-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
        .story-split { grid-template-columns: 1fr !important; }
        .bento-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
        .bento-tall { grid-row: span 1 !important; }
        .bento-wide { grid-column: span 1 !important; }
      }
      @media (max-width: 480px) {
        .product-grid-3 { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(styleEl);

    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach(el => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove("will-reveal");
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }), { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => { io.disconnect(); document.head.removeChild(styleEl); };
  }, []);

  const handleAddToCart = (p: typeof products[0], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [p.id]: false })), 1500);
  };

  const handleAddCrowd = (p: typeof crowdFavourites[0], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedCrowdIds(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedCrowdIds(prev => ({ ...prev, [p.id]: false })), 1500);
  };

  const handleCardClick = (p: typeof products[0]) => {
    router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`);
  };

  // Category rail drag
  const onCatMouseDown = (e: React.MouseEvent) => {
    if (!catRailRef.current) return;
    setCatDragging(true);
    setCatDragStart(e.pageX);
    setCatScrollStart(catRailRef.current.scrollLeft);
  };
  const onCatMouseMove = (e: React.MouseEvent) => {
    if (!catDragging || !catRailRef.current) return;
    catRailRef.current.scrollLeft = catScrollStart - (e.pageX - catDragStart);
  };
  const onCatMouseUp = () => setCatDragging(false);

  // Crowd rail drag
  const onCrowdMouseDown = (e: React.MouseEvent) => {
    if (!crowdRailRef.current) return;
    setCrowdDragging(true);
    setCrowdDragStart(e.pageX);
    setCrowdScrollStart(crowdRailRef.current.scrollLeft);
  };
  const onCrowdMouseMove = (e: React.MouseEvent) => {
    if (!crowdDragging || !crowdRailRef.current) return;
    crowdRailRef.current.scrollLeft = crowdScrollStart - (e.pageX - crowdDragStart);
  };
  const onCrowdMouseUp = () => setCrowdDragging(false);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* ── HERO: SPLIT_TEXT_LEFT ── */}
      <section
        className="hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "60fr 40fr",
          minHeight: "92vh",
          position: "relative",
        }}
      >
        {/* LEFT: text column */}
        <div
          className="hero-left"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "120px",
            paddingBottom: "80px",
            paddingLeft: "clamp(24px,6vw,96px)",
            paddingRight: "clamp(24px,4vw,64px)",
            background: "var(--bg)",
            zIndex: 2,
          }}
        >
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "var(--accent)",
            marginBottom: "20px",
          }}>
            The Collection · 2025
          </p>

          <h1 style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(3.5rem, 6.5vw, 6rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--text)",
            marginBottom: "24px",
            maxWidth: "640px",
          }}>
            Elevate Your<br />Every Day.
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
            fontWeight: 400,
            lineHeight: 1.7,
            color: "var(--muted)",
            maxWidth: "440px",
            marginBottom: "36px",
          }}>
            Essentials built for the urban Indian who moves with intention. Clean cuts, honest materials, no noise.
          </p>

          {/* Trust pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
            {[
              { icon: "★", text: "4.9 · 2,800+ reviews" },
              { icon: null, text: "Made in India" },
              { icon: null, text: "Free delivery ₹599+" },
              { icon: null, text: "30-day returns" },
            ].map((pill, i) => (
              <span key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "999px",
                border: "1px solid color-mix(in srgb, var(--muted) 40%, transparent)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--muted)",
                fontFamily: "var(--font-body)",
              }}>
                {pill.icon && <span style={{ color: "var(--accent)", fontSize: "0.8rem" }}>{pill.icon}</span>}
                {pill.text}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                height: "56px",
                padding: "0 36px",
                borderRadius: "4px",
                border: "none",
                background: "var(--accent)",
                color: "#0E0C14",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.02em",
                boxShadow: "none",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Discover Products
            </button>
            <span style={{ fontSize: "0.8125rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
              Trusted by 25,000+ happy customers
            </span>
          </div>
        </div>

        {/* RIGHT: full-bleed product image */}
        <div
          className="hero-right"
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "92vh",
          }}
        >
          <img
            src="/product-1.jpg"
            alt="Hi Classic Tee — hero product shot"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
          {/* Subtle left edge gradient so it bleeds into bg naturally */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, var(--bg) 0%, transparent 18%)",
            pointerEvents: "none",
          }} />
          {/* Price badge floating */}
          <div style={{
            position: "absolute",
            bottom: "48px",
            left: "28px",
            background: "var(--accent)",
            color: "#0E0C14",
            fontFamily: "var(--font-body)",
            fontWeight: 800,
            fontSize: "1.125rem",
            padding: "10px 20px",
            borderRadius: "4px",
            zIndex: 3,
          }}>
            From ₹199
          </div>
        </div>
      </section>

      {/* ── CATEGORY STRIP: HORIZONTAL_RAIL ── */}
      <section
        className="reveal"
        style={{
          borderBottom: "1px solid color-mix(in srgb, var(--muted) 25%, transparent)",
          borderTop: "1px solid color-mix(in srgb, var(--muted) 25%, transparent)",
          background: "var(--bg)",
          padding: "0",
        }}
      >
        <div
          ref={catRailRef}
          className="rail-scroll"
          style={{
            display: "flex",
            gap: "0",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            cursor: catDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
          onMouseDown={onCatMouseDown}
          onMouseMove={onCatMouseMove}
          onMouseUp={onCatMouseUp}
          onMouseLeave={onCatMouseUp}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              className="cat-tile"
              style={{
                flex: "0 0 auto",
                width: "160px",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px 16px",
                borderRight: i < categories.length - 1 ? "1px solid color-mix(in srgb, var(--muted) 25%, transparent)" : "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onClick={() => document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb, var(--surface) 10%, transparent)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "12px",
                background: "color-mix(in srgb, var(--surface) 20%, transparent)",
              }}>
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="cat-img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                />
              </div>
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT GRID: 3-column forced ── */}
      <section
        id="product-grid-section"
        className="reveal"
        style={{
          padding: "80px clamp(20px,5vw,80px)",
          background: "var(--bg)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "12px" }}>
            <h2 style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}>
              All Products
            </h2>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--muted)" }}>
              {products.length} pieces
            </span>
          </div>

          {/* Force 3-column grid — 4th card slot becomes a CTA tile */}
          <div
            className="product-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {products.map(p => (
              <article
                key={p.id}
                className="product-card"
                style={{
                  position: "relative",
                  background: "color-mix(in srgb, var(--surface) 15%, var(--bg))",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  border: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
                onClick={() => handleCardClick(p)}
              >
                {p.badge && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "var(--accent)",
                    color: "#0E0C14",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: "2px",
                    zIndex: 2,
                  }}>{p.badge}</div>
                )}

                <div style={{ overflow: "hidden", background: "color-mix(in srgb, var(--bg) 80%, var(--surface))" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>

                {/* Quick view overlay */}
                <div
                  className="quick-overlay"
                  style={{
                    position: "absolute",
                    bottom: "88px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    zIndex: 3,
                    whiteSpace: "nowrap",
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleCardClick(p);
                  }}
                >
                  <div style={{
                    padding: "8px 18px",
                    borderRadius: "2px",
                    border: "1.5px solid var(--accent)",
                    background: "color-mix(in srgb, var(--bg) 85%, transparent)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}>
                    View Details
                  </div>
                </div>

                <div style={{ padding: "16px 20px 20px" }}>
                  <h3 style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: "8px",
                    lineHeight: 1.3,
                  }}>{p.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}>₹{p.price.toLocaleString("en-IN")}</p>
                    <button
                      onClick={e => handleAddToCart(p, e)}
                      style={{
                        height: "34px",
                        padding: "0 16px",
                        borderRadius: "4px",
                        border: "none",
                        background: addedIds[p.id] ? "var(--muted)" : "var(--accent)",
                        color: "#0E0C14",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        boxShadow: "none",
                        transition: "transform 0.15s ease, background 0.18s ease",
                        letterSpacing: "0.02em",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    >
                      {addedIds[p.id] ? "Added ✓" : "Add to Bag"}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* CTA tile — prevents orphaned card on grid row 2 */}
            <div
              style={{
                borderRadius: "var(--radius-md)",
                border: "2px dashed color-mix(in srgb, var(--accent) 40%, transparent)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "40px 24px",
                cursor: "pointer",
                transition: "border-color 0.2s ease, background 0.2s ease",
                background: "transparent",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 6%, transparent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 40%, transparent)";
                e.currentTarget.style.background = "transparent";
              }}
              onClick={() => router.push('/shop')}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--accent)",
                textAlign: "center",
                lineHeight: 1.4,
              }}>
                More arriving<br />soon
              </p>
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--muted)",
                textAlign: "center",
              }}>
                New drops every month
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY SPLIT: ASYMMETRIC_SPLIT ── */}
      <section
        className="reveal"
        id="story-section"
        style={{
          padding: "80px clamp(20px,5vw,80px)",
          background: "color-mix(in srgb, var(--surface) 8%, var(--bg))",
        }}
      >
        <div
          className="story-split"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "60fr 40fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "var(--accent)",
              marginBottom: "20px",
            }}>
              Our Story
            </p>
            <h2 style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(2rem,3.5vw,3.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text)",
              marginBottom: "24px",
            }}>
              Built for the room<br />you're about to walk into.
            </h2>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "var(--muted)",
              maxWidth: "480px",
              marginBottom: "32px",
            }}>
              Hi was born from a simple conviction: great everyday essentials shouldn't be a trade-off between quality and price. Every piece is designed in India for India — cut for real bodies, made to outlast the algorithm.
            </p>
            <button
              onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                height: "48px",
                padding: "0 28px",
                borderRadius: "4px",
                border: "1.5px solid var(--accent)",
                background: "transparent",
                color: "var(--accent)",
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "none",
                transition: "transform 0.15s ease, background 0.18s ease",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 10%, transparent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "transparent";
              }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              The Hi Philosophy
            </button>
          </div>

          <div style={{ overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
            <img
              src="/product-2.jpg"
              alt="Hi brand story — quality craftsmanship"
              style={{
                width: "100%",
                aspectRatio: "3/4",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ── INGREDIENT CLOSEUP: BENTO with named grid areas ── */}
      <section
        className="reveal"
        style={{
          padding: "80px clamp(20px,5vw,80px)",
          background: "var(--bg)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "var(--accent)",
            marginBottom: "16px",
          }}>
            Formulated to deliver
          </p>
          <h2 style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1.8rem,3vw,2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            marginBottom: "40px",
          }}>
            Every detail. On purpose.
          </h2>

          {/* Bento: tall image left (2 rows), wide stat top-right, icon tile bottom-right */}
          <div
            className="bento-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "300px 160px",
              gap: "16px",
            }}
          >
            {/* Tall image — left, spans 2 rows */}
            <div
              className="bento-tall"
              style={{
                gridRow: "span 2",
                overflow: "hidden",
                borderRadius: "var(--radius-lg)",
                position: "relative",
              }}
            >
              <img
                src="/product-3.jpg"
                alt="Hi Cotton Cap — precision craftsmanship detail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                background: "color-mix(in srgb, var(--bg) 70%, transparent)",
                backdropFilter: "blur(12px)",
                padding: "12px 20px",
                borderRadius: "4px",
              }}>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  letterSpacing: "0.04em",
                }}>Precision fit, always</p>
              </div>
            </div>

            {/* Wide stat tile — top right, 2px solid border */}
            <div
              className="bento-wide"
              style={{
                borderRadius: "var(--radius-lg)",
                border: "2px solid #1a1a1a",
                background: "color-mix(in srgb, var(--surface) 15%, var(--bg))",
                display: "flex",
                alignItems: "center",
                padding: "32px",
                gap: "24px",
              }}
            >
              <div>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(3rem,5vw,5rem)",
                  fontWeight: 800,
                  color: "var(--accent)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}>28</p>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  lineHeight: 1.5,
                  marginTop: "6px",
                }}>thread counts<br />above industry standard</p>
              </div>
              <div style={{
                width: "1px",
                alignSelf: "stretch",
                background: "color-mix(in srgb, var(--muted) 30%, transparent)",
                flexShrink: 0,
              }} />
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--muted)",
                lineHeight: 1.6,
              }}>
                We source only certified cotton that outlasts fast fashion by years, not seasons.
              </p>
            </div>

            {/* Small icon tile — bottom right */}
            <div
              style={{
                borderRadius: "var(--radius-md)",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "24px",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0E0C14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "#0E0C14",
                  lineHeight: 1.2,
                }}>Zero compromise</p>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  color: "color-mix(in srgb, #0E0C14 70%, transparent)",
                  marginTop: "4px",
                }}>OEKO-TEX certified fabrics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND MANIFESTO: full-bleed near-black band ── */}
      <section
        className="reveal"
        style={{
          background: "#1a1a1a",
          padding: "96px clamp(24px,6vw,96px)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* 2px terracotta horizontal rule above quote mark */}
          <div style={{
            width: "48px",
            height: "2px",
            background: "var(--accent)",
            marginBottom: "32px",
          }} />
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(2rem,3.5vw,3rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            color: "var(--primary)",
            marginBottom: "32px",
          }}>
            "We didn't build Hi for the algorithm. We built it for the room you walk into — and the way you own it."
          </p>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            — The Hi Founders
          </p>
        </div>
      </section>

      {/* ── FEATURE TRIO: BENTO_MOSAIC ── */}
      <section
        className="reveal"
        style={{
          padding: "80px clamp(20px,5vw,80px)",
          background: "var(--bg)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1.8rem,3vw,2.6rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            marginBottom: "40px",
          }}>
            Why Hi?
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            gridAutoRows: "220px",
          }}>
            {/* Large tile — spans 2 cols */}
            <div style={{
              gridColumn: "span 2",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              position: "relative",
            }}>
              <img
                src="/product-4.jpg"
                alt="Hi brand essentials quality showcase"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, color-mix(in srgb, var(--bg) 80%, transparent) 0%, transparent 50%)",
              }} />
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
              }}>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--text)",
                }}>Real quality.<br />Real price.</p>
              </div>
            </div>

            {/* Stat tile — tall, spans 2 rows */}
            <div style={{
              gridRow: "span 2",
              borderRadius: "var(--radius-lg)",
              background: "color-mix(in srgb, var(--accent) 12%, var(--bg))",
              border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "32px",
              gap: "16px",
            }}>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(3rem,4vw,4rem)",
                fontWeight: 800,
                color: "var(--accent)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}>25k+</p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text)",
                lineHeight: 1.4,
              }}>Happy customers across India</p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--muted)",
                lineHeight: 1.6,
              }}>
                From Mumbai to Manipur — Hi is worn by people who know what they want.
              </p>
            </div>

            {/* Small icon tile */}
            <div style={{
              borderRadius: "var(--radius-md)",
              background: "color-mix(in srgb, var(--surface) 12%, var(--bg))",
              border: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "24px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, color: "var(--text)" }}>Made in India</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", marginTop: "2px" }}>Every stitch, every time</p>
              </div>
            </div>

            {/* Testimonial tile */}
            <div style={{
              borderRadius: "var(--radius-md)",
              background: "color-mix(in srgb, var(--primary) 8%, var(--bg))",
              border: "1px solid color-mix(in srgb, var(--muted) 18%, transparent)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "24px",
            }}>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontStyle: "italic",
                color: "var(--text)",
                lineHeight: 1.6,
              }}>
                "Wore the Hi Tee to three meetings. Got asked where I got it at all three."
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--accent)",
                fontWeight: 600,
                marginTop: "12px",
              }}>★★★★★ · Arjun, Bengaluru</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section
        className="reveal"
        style={{
          padding: "80px clamp(20px,5vw,80px)",
          background: "color-mix(in srgb, var(--surface) 8%, var(--bg))",
          borderTop: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "var(--accent)",
            marginBottom: "16px",
          }}>
            Stay in the loop
          </p>
          <h2 style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1.8rem,3vw,2.6rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            marginBottom: "12px",
          }}>
            New drops. First.
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: "32px",
          }}>
            Join 25,000+ Hi customers who get early access to new collections and exclusive offers.
          </p>

          {subscribed ? (
            <div style={{
              padding: "20px 32px",
              borderRadius: "4px",
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
            }}>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--accent)",
              }}>You're in. Watch your inbox.</p>
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
              style={{ display: "flex", gap: "0", maxWidth: "460px", margin: "0 auto" }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  height: "52px",
                  padding: "0 20px",
                  borderRadius: "4px 0 0 4px",
                  border: "1.5px solid color-mix(in srgb, var(--muted) 40%, transparent)",
                  borderRight: "none",
                  background: "color-mix(in srgb, var(--surface) 8%, var(--bg))",
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  height: "52px",
                  padding: "0 28px",
                  borderRadius: "0 4px 4px 0",
                  border: "none",
                  background: "var(--accent)",
                  color: "#0E0C14",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  transition: "transform 0.15s ease",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── CROWD FAVOURITES: HORIZONTAL_RAIL — white cards ── */}
      <section
        className="reveal"
        style={{
          padding: "80px 0",
          background: "var(--bg)",
          borderTop: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)",
        }}
      >
        <div style={{ paddingLeft: "clamp(20px,5vw,80px)", paddingRight: "clamp(20px,5vw,80px)", marginBottom: "32px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h2 style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.8rem,3vw,2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}>
              Crowd Favourites
            </h2>
            <button
              onClick={() => router.push('/shop')}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--accent)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.04em",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              View All
            </button>
          </div>
        </div>

        {/* Horizontal drag-scroll rail */}
        <div
          ref={crowdRailRef}
          className="rail-scroll"
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: "clamp(20px,5vw,80px)",
            paddingRight: "clamp(20px,5vw,80px)",
            cursor: crowdDragging ? "grabbing" : "grab",
            userSelect: "none",
            paddingBottom: "8px",
          }}
          onMouseDown={onCrowdMouseDown}
          onMouseMove={onCrowdMouseMove}
          onMouseUp={onCrowdMouseUp}
          onMouseLeave={onCrowdMouseUp}
        >
          {crowdFavourites.map(p => (
            <div
              key={p.id}
              style={{
                flex: "0 0 auto",
                width: "280px",
                scrollSnapAlign: "start",
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
            >
              <div style={{ overflow: "hidden", background: "#f4f4f4" }}>
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
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "16px 18px 18px" }}>
                <h3 style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}>{p.name}</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                  }}>₹{p.price.toLocaleString("en-IN")}</p>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleAddCrowd(p, e);
                    }}
                    style={{
                      height: "32px",
                      padding: "0 14px",
                      borderRadius: "4px",
                      border: "none",
                      background: addedCrowdIds[p.id] ? "#888" : "var(--accent)",
                      color: "#0E0C14",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      boxShadow: "none",
                      transition: "transform 0.15s ease, background 0.18s ease",
                      letterSpacing: "0.02em",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  >
                    {addedCrowdIds[p.id] ? "Added ✓" : "Add to Bag"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE TRUST STRIP ── */}
      <section style={{ background: "var(--accent)", overflow: "hidden", padding: "16px 0" }}>
        <div className="marquee-track" style={{ display: "flex", gap: "0", width: "max-content" }}>
          {[
            "Own Every Room",
            "Made in India",
            "Clean cuts · Real results",
            "Trusted by 25,000+ customers",
            "Free delivery above ₹599",
            "30-day returns",
            "Own Every Room",
            "Made in India",
            "Clean cuts · Real results",
            "Trusted by 25,000+ customers",
            "Free delivery above ₹599",
            "30-day returns",
          ].map((item, i) => (
            <span key={i} style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#0E0C14",
              padding: "0 40px",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
              {item}
              <span style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", background: "#0E0C14", opacity: 0.5 }} />
            </span>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}