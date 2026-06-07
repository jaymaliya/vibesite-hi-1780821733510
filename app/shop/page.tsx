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

const filters = ["All Products", "Bestsellers", "New Arrivals"];

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };

  const [activeFilter, setActiveFilter] = useState("All Products");
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [quickView, setQuickView] = useState<typeof products[0] | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const filteredProducts = activeFilter === "All Products"
    ? products
    : products.filter(p => p.category === activeFilter);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
      .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease-out, transform 0.65s ease-out; }
      .will-reveal.visible { opacity: 1; transform: translateY(0); }
      .rail-scroll::-webkit-scrollbar { display: none; }
      .rail-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      .quick-view-btn { opacity: 0; transition: opacity 0.2s ease; }
      .product-card:hover .quick-view-btn { opacity: 1; }
      @keyframes marquee-left {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-track { animation: marquee-left 32s linear infinite; }
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

  const handleCardClick = (p: typeof products[0]) => {
    router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`);
  };

  // Rail drag-scroll
  const onMouseDown = (e: React.MouseEvent) => {
    if (!railRef.current) return;
    setIsDragging(true);
    setDragStart(e.pageX);
    setScrollStart(railRef.current.scrollLeft);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !railRef.current) return;
    railRef.current.scrollLeft = scrollStart - (e.pageX - dragStart);
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <section style={{ paddingTop: "120px", paddingBottom: "0", paddingLeft: "clamp(20px,5vw,80px)", paddingRight: "clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)", marginBottom: "12px" }}>
            The Collection
          </p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05, color: "var(--text)", marginBottom: "24px" }}>
            Everything you need.<br />Nothing you don't.
          </h1>
          {/* Trust strip */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "40px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              4.9 · 2,800+ reviews
            </span>
            <span>Made in India</span>
            <span>Free delivery above ₹599</span>
            <span>30-day returns</span>
          </div>
        </div>
      </section>

      {/* ── FILTER PILLS ── */}
      <section className="reveal" style={{ paddingBottom: "32px", paddingLeft: "clamp(20px,5vw,80px)", paddingRight: "clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  height: "36px",
                  padding: "0 20px",
                  borderRadius: "999px",
                  border: activeFilter === f ? "none" : "1px solid #C8C4BC",
                  background: activeFilter === f ? "var(--accent)" : "transparent",
                  color: activeFilter === f ? "#fff" : "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
                }}
                onMouseEnter={e => { if (activeFilter !== f) (e.currentTarget.style.background = "var(--surface)"); }}
                onMouseLeave={e => { if (activeFilter !== f) (e.currentTarget.style.background = "transparent"); }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="reveal" style={{ paddingBottom: "var(--space-section)", paddingLeft: "clamp(20px,5vw,80px)", paddingRight: "clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "24px 24px" }}>
            {filteredProducts.map(p => (
              <article
                key={p.id}
                className="product-card"
                style={{
                  position: "relative",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={e => {
                  setHoveredCard(p.id);
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={e => {
                  setHoveredCard(null);
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
                onClick={() => handleCardClick(p)}
              >
                {/* Badge */}
                {p.badge && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "var(--primary)",
                    color: "#fff",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "2px",
                    zIndex: 2,
                  }}>{p.badge}</div>
                )}

                {/* Image */}
                <div style={{ overflow: "hidden", background: "var(--bg)" }}>
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
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>

                {/* Quick View overlay */}
                <div
                  className="quick-view-btn"
                  style={{
                    position: "absolute",
                    bottom: "96px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 3,
                  }}
                  onClick={e => { e.stopPropagation(); setQuickView(p); }}
                >
                  <div style={{
                    height: "38px",
                    padding: "0 20px",
                    borderRadius: "var(--radius-sm)",
                    border: "2px solid var(--accent)",
                    background: "rgba(245,240,232,0.95)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}>
                    Quick View
                  </div>
                </div>

                {/* Card info */}
                <div style={{ padding: "16px 16px 20px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "4px" }}>{p.description}</p>
                  <h3 style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)", marginBottom: "6px", lineHeight: 1.3 }}>{p.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>₹{p.price.toLocaleString("en-IN")}</p>
                    <button
                      onClick={e => handleAddToCart(p, e)}
                      style={{
                        height: "36px",
                        padding: "0 16px",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        background: addedIds[p.id] ? "var(--primary)" : "var(--accent)",
                        color: "#fff",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "background 0.18s ease, transform 0.15s ease",
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
          </div>
        </div>
      </section>

      {/* ── TRUST / MARQUEE STRIP ── */}
      <section className="reveal" style={{ background: "var(--accent)", overflow: "hidden", padding: "18px 0" }}>
        <div className="marquee-track" style={{ display: "flex", gap: "0", width: "max-content" }}>
          {[
            "Confidence in a bottle",
            "Made with intention",
            "Clean formulas · Real results",
            "Trusted by 25,000+ customers",
            "Free delivery above ₹599",
            "Made in India",
            "Confidence in a bottle",
            "Made with intention",
            "Clean formulas · Real results",
            "Trusted by 25,000+ customers",
            "Free delivery above ₹599",
            "Made in India",
          ].map((t, i) => (
            <span key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap", padding: "0 40px" }}>
              {t}
              <span style={{ marginLeft: "40px", color: "rgba(255,255,255,0.4)" }}>·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── STORY SPLIT: ASYMMETRIC ── */}
      <section className="reveal" id="about" style={{ background: "var(--surface)", padding: "var(--space-section) clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "64px", alignItems: "center" }}>
          {/* Image */}
          <div style={{ overflow: "hidden", borderRadius: "var(--radius-lg)", background: "var(--surface)" }}>
            <img
              src="/product-1.jpg"
              alt="Hi product story — close crop editorial"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", transition: "transform 0.7s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          {/* Text */}
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--accent)", marginBottom: "16px" }}>Our Story</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", marginBottom: "24px" }}>
              Built for the<br />room you're about<br />to walk into.
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "32px", maxWidth: "480px" }}>
              Hi was born from a simple truth — how you feel in your skin shapes every interaction. We stripped every formula back to what works, sourced ingredients with intention, and built a range that fits into your life without demanding attention.
            </p>
            <button
              onClick={() => router.push('/shop')}
              style={{
                height: "48px",
                padding: "0 28px",
                borderRadius: "var(--radius-sm)",
                border: "2px solid var(--accent)",
                background: "transparent",
                color: "var(--accent)",
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.18s ease, color 0.18s ease, transform 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Explore the Range
            </button>
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURE GRID ── */}
      <section className="reveal" id="features" style={{ background: "var(--bg)", padding: "var(--space-section) clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)", marginBottom: "12px" }}>Why Hi</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", marginBottom: "48px" }}>
            Formulated to deliver.
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "16px",
          }}>
            {/* Tile 1 — tall */}
            <div style={{ gridRow: "span 2", background: "var(--surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ overflow: "hidden", flex: "1" }}>
                <img src="/product-1.jpg" alt="Hi product detail shot" style={{ width: "100%", height: "100%", minHeight: "220px", objectFit: "cover", display: "block", transition: "transform 0.7s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ padding: "24px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)", marginBottom: "8px" }}>Real ingredients</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.65, color: "var(--muted)" }}>Every formula traces back to a source we've verified — no fillers, no shortcuts.</p>
              </div>
            </div>
            {/* Tile 2 */}
            <div style={{ background: "var(--primary)", borderRadius: "var(--radius-lg)", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 700, color: "#fff", lineHeight: 1 }}>28</p>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: "4px" }}>Days to visible result</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>Clinically observed. Consistency-backed.</p>
              </div>
            </div>
            {/* Tile 3 */}
            <div style={{ background: "var(--accent)", borderRadius: "var(--radius-lg)", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>Dermatologist tested</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>Safe for all skin types. Patch-tested every batch.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CROWD FAVOURITES: Horizontal Drag Rail ── */}
      <section className="reveal" style={{ background: "var(--surface)", padding: "var(--space-section) 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingLeft: "clamp(20px,5vw,80px)", paddingRight: "clamp(20px,5vw,80px)", marginBottom: "32px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)", marginBottom: "12px" }}>Crowd Favourites</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>
              What people keep<br />coming back for.
            </h2>
            <button
              onClick={() => router.push('/shop')}
              style={{ height: "40px", padding: "0 20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary)", background: "transparent", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.18s ease, transform 0.15s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; }}
            >
              View All
            </button>
          </div>
        </div>

        {/* Rail */}
        <div
          ref={railRef}
          className="rail-scroll"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: "clamp(20px,5vw,80px)",
            paddingRight: "clamp(20px,5vw,80px)",
            paddingBottom: "8px",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
        >
          {products.map(p => (
            <div
              key={p.id}
              style={{
                flex: "0 0 auto",
                width: "clamp(240px,30vw,280px)",
                scrollSnapAlign: "start",
                background: "var(--bg)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                position: "relative",
                boxShadow: "var(--shadow-sm)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => handleCardClick(p)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
            >
              {/* BEST badge */}
              <div style={{ position: "absolute", top: "14px", right: "14px", width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.5625rem", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>BEST</span>
              </div>
              <div style={{ overflow: "hidden", background: "var(--bg)" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", borderRadius: "4px", transition: "transform 0.6s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "14px 16px 18px" }}>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>{p.name}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>₹{p.price.toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND MANIFESTO ── */}
      <section className="reveal" style={{ background: "#fff", padding: "var(--space-section) clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: "60px", height: "1px", background: "#CCCCCC", margin: "0 auto 40px" }} />
          <blockquote style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.75rem,4vw,3rem)",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            color: "var(--text)",
            margin: "0",
          }}>
            "Confidence isn't loud. It's the quiet certainty that you've already handled it."
          </blockquote>
          <div style={{ width: "60px", height: "1px", background: "#CCCCCC", margin: "40px auto 0" }} />
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="reveal" style={{ background: "var(--primary)", padding: "var(--space-section) clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>Stay in the loop</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "16px" }}>
            New arrivals. Real stories.<br />No noise.
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: "36px" }}>
            Join 25,000+ who get early access to new products and honest updates.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <Footer />

      {/* ── QUICK VIEW MODAL ── */}
      {quickView && (
        <div
          onClick={() => setQuickView(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(30,28,24,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--bg)", borderRadius: "var(--radius-lg)", maxWidth: "880px", width: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", boxShadow: "var(--shadow-xl)", maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Image */}
            <div style={{ background: "var(--bg)", overflow: "hidden" }}>
              <img src={quickView.img} alt={quickView.name} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
            </div>
            {/* Info */}
            <div style={{ padding: "clamp(24px,4vw,40px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <button
                onClick={() => setQuickView(null)}
                style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "1.5rem", lineHeight: 1, marginBottom: "24px", padding: "4px" }}
                aria-label="Close quick view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "6px" }}>{quickView.description}</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "16px" }}>{quickView.name}</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)", marginBottom: "32px" }}>₹{quickView.price.toLocaleString("en-IN")}</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={() => { handleAddToCart(quickView); }}
                  style={{
                    flex: "1", minWidth: "140px", height: "52px", borderRadius: "var(--radius-sm)", border: "none", background: addedIds[quickView.id] ? "var(--primary)" : "var(--accent)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.18s ease, transform 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {addedIds[quickView.id] ? "Added ✓" : "Add to Bag"}
                </button>
                <button
                  onClick={() => { setQuickView(null); handleCardClick(quickView); }}
                  style={{
                    flex: "1", minWidth: "120px", height: "52px", borderRadius: "var(--radius-sm)", border: "2px solid var(--primary)", background: "transparent", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.18s ease, transform 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  View Details
                </button>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--muted)", marginTop: "20px" }}>Free delivery above ₹599 · 30-day returns</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setStatus("done");
    setEmail("");
  };

  if (status === "done") {
    return (
      <div style={{ padding: "20px", background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 500 }}>
        You're in. We'll be in touch soon. 👋
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        style={{
          flex: "1 1 220px",
          height: "52px",
          padding: "0 18px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          fontFamily: "var(--font-body)",
          fontSize: "0.9375rem",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          height: "52px",
          padding: "0 28px",
          borderRadius: "var(--radius-sm)",
          border: "none",
          background: "var(--accent)",
          color: "#fff",
          fontFamily: "var(--font-body)",
          fontSize: "0.9375rem",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "transform 0.15s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}