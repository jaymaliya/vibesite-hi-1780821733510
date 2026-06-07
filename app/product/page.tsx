"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const allProducts = [
  { id: 1, img: "/product-1.jpg", name: "Hi", description: "Hi", price: 499, specs: [] as {label:string;value:string}[] }
];

const reviews = [
  { name: "Shreya Nair", city: "Chennai", stars: 5, date: "March 2025", text: "Honestly did not expect this to make such a difference. The simplicity is the whole point — I use it every single morning now." },
  { name: "Kabir Verma", city: "Pune", stars: 4, date: "February 2025", text: "Very clean, very direct. The product does what it says. Packaging is minimal and I appreciate that. Would buy again." },
  { name: "Divya Krishnan", city: "Hyderabad", stars: 5, date: "January 2025", text: "Feels premium without trying too hard. Exactly what I needed. Worth the price easily." },
];

function StarRow({ count }: { count: number }) {
const products = [
  { id: 1, img: "/product-1.jpg", name: "", description: "Hi", price: 499, badge: "NEW" }
];
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= count ? "var(--accent)" : "var(--surface)"} stroke={i <= count ? "var(--accent)" : "var(--muted)"} strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };

  const paramImg   = searchParams.get("img")   ? decodeURIComponent(searchParams.get("img")!)   : null;
  const paramName  = searchParams.get("name")  ? decodeURIComponent(searchParams.get("name")!)  : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price"))               : null;

  const displayImg  = paramImg  ?? "/product-1.jpg";
  const displayName = paramName ?? "Hi";
  const displayPrice = paramPrice ?? 499;

  const matchedProduct = allProducts.find(p => p.name === displayName) ?? allProducts[0];
  const specs = matchedProduct.specs;

  const [quantity, setQuantity]     = useState(1);
  const [addedCart, setAddedCart]   = useState(false);
  const [isMobile, setIsMobile]     = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease-out, transform 0.65s ease-out; }
      .will-reveal.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach(el => {
      if (el.getBoundingClientRect().top > vp) el.classList.add("will-reveal");
      else el.classList.add("visible");
    });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove("will-reveal");
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }), { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleAddToCart = () => {
    addItem({ id: String(matchedProduct.id), name: displayName, price: displayPrice, quantity, image: displayImg });
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({ id: String(matchedProduct.id), name: displayName, price: displayPrice, quantity, image: displayImg });
    router.push("/checkout");
  };

  const decQty = () => setQuantity(q => Math.max(1, q - 1));
  const incQty = () => setQuantity(q => q + 1);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* ─── PRODUCT DETAIL ─── */}
      <main style={{ paddingTop: "80px", paddingBottom: isMobile ? "96px" : "0" }}>

        {/* Two-column layout */}
        <section style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "32px 20px 48px" : "64px 48px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "55fr 45fr",
          gap: isMobile ? "32px" : "64px",
          alignItems: "start"
        }}>

          {/* ── LEFT: Image ── */}
          <div style={{ position: isMobile ? "relative" : "sticky", top: isMobile ? undefined : "104px" }}>
            <div style={{ overflow: "hidden", borderRadius: "var(--radius-lg)", background: "var(--surface)", aspectRatio: "3/4", maxHeight: isMobile ? "70vw" : "70vh" }}>
              <img
                src={displayImg}
                alt={displayName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.6s ease",
                  cursor: "zoom-in",
                  display: "block"
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>

            {/* Trust signal row */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "20px",
              fontSize: "0.8rem",
              color: "var(--muted)",
              letterSpacing: "0.04em"
            }}>
              {["Free delivery above ₹499", "Made in India", "25,000+ happy customers"].map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Info panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Eyebrow */}
            <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)", margin: 0 }}>
              Hi Studio
            </p>

            {/* Name */}
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text)",
              margin: 0
            }}>
              {displayName || "Hi"}
            </h1>

            {/* Short description */}
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", margin: 0, maxWidth: "440px" }}>
              Quiet confidence in every use. Designed for the urban Indian who demands simplicity and substance without compromise.
            </p>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--accent)" }}>
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Incl. of all taxes</span>
            </div>

            {/* Rating row */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.875rem", color: "var(--muted)" }}>
              <StarRow count={5} />
              <span>4.8 · 214 reviews</span>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "var(--surface)" }} />

            {/* Quantity selector */}
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", marginBottom: "10px" }}>
                Quantity
              </p>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid var(--surface)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                height: "48px"
              }}>
                <button
                  onClick={decQty}
                  style={{ width: "48px", height: "48px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  aria-label="Decrease quantity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span style={{ width: "48px", textAlign: "center", fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>{quantity}</span>
                <button
                  onClick={incQty}
                  style={{ width: "48px", height: "48px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  aria-label="Increase quantity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>

            {/* CTAs — hidden on mobile (sticky bar takes over) */}
            {!isMobile && (
              <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    height: "60px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: addedCart ? "var(--primary)" : "var(--accent)",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s ease, transform 0.15s ease",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                >
                  {addedCart ? "✓ Added to Bag" : "Add to Bag"}
                </button>
                <button
                  onClick={handleBuyNow}
                  style={{
                    height: "60px",
                    borderRadius: "var(--radius-md)",
                    border: "2px solid var(--primary)",
                    background: "transparent",
                    color: "var(--text)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* Specs grid — only if specs exist */}
            {specs.length > 0 && (
              <div style={{ borderTop: "1px solid var(--surface)", paddingTop: "24px" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", marginBottom: "16px" }}>
                  Specifications
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "12px 24px" }}>
                  {specs.map((s) => (
                    <div key={s.label}>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: "0 0 2px" }}>{s.label}</p>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features strip */}
            <div style={{
              borderTop: "1px solid var(--surface)",
              paddingTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              {[
                { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Quality Guaranteed", sub: "Every batch tested for consistency" },
                { icon: "M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", label: "Minimal Packaging", sub: "Responsibly made and packaged" },
                { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", label: "No Compromises", sub: "Made for everyday confidence" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={f.icon} />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", margin: "0 0 2px" }}>{f.label}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── EDITORIAL STORY SPLIT ─── */}
        <section className="reveal" style={{
          background: "var(--surface)",
          padding: isMobile ? "48px 20px" : "80px 48px"
        }}>
          <div style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "60fr 40fr",
            gap: isMobile ? "32px" : "64px",
            alignItems: "center"
          }}>
            <div style={{ overflow: "hidden", borderRadius: "var(--radius-lg)", aspectRatio: "4/3" }}>
              <img
                src={displayImg}
                alt={`${displayName} detail`}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease", display: "block" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--accent)", marginBottom: "16px" }}>
                The Story
              </p>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "var(--text)",
                marginBottom: "20px"
              }}>
                Designed for the ones who already know.
              </h2>
              <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "24px" }}>
                Hi was built on a simple idea: that the best products don't shout. They show up every day, consistently, and do their job with quiet precision. No excess, no filler — just the thing you actually need.
              </p>
              <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)" }}>
                Formulated with care in India, for India. Every detail considered. Nothing superfluous.
              </p>
            </div>
          </div>
        </section>

        {/* ─── REVIEWS ─── */}
        <section className="reveal" style={{
          background: "var(--bg)",
          padding: isMobile ? "48px 20px" : "80px 48px"
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ marginBottom: "40px" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)", marginBottom: "8px" }}>
                Customer Stories
              </p>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--text)",
                margin: 0
              }}>
                What they're saying.
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px"
            }}>
              {reviews.map((r, i) => (
                <article
                  key={i}
                  style={{
                    background: "var(--surface)",
                    borderRadius: "var(--radius-md)",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxShadow: "var(--shadow-sm)",
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)"
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; }}
                >
                  <StarRow count={r.stars} />
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text)", margin: 0, fontStyle: "italic" }}>
                    "{r.text}"
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>{r.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{r.city} · {r.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── YOU MIGHT ALSO LIKE ─── */}
        <section className="reveal" style={{
          background: "var(--surface)",
          padding: isMobile ? "48px 20px" : "80px 48px"
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)", marginBottom: "8px" }}>
                Explore
              </p>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--text)",
                margin: 0
              }}>
                You might also like.
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px"
            }}>
              {allProducts.map(p => (
                <article
                  key={p.id}
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                  style={{
                    cursor: "pointer",
                    background: "var(--bg)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)"
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; }}
                >
                  <div style={{ overflow: "hidden", aspectRatio: "4/5", background: "var(--surface)" }}>
                    <img
                      src={p.img}
                      alt={p.name || "Hi product"}
                      style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.6s ease", display: "block" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>{p.name || "Hi"}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--muted)", margin: "0 0 8px" }}>{p.description}</p>
                    <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)", margin: 0 }}>₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MANIFESTO PULLQUOTE ─── */}
        <section className="reveal" style={{
          background: "#fff",
          padding: isMobile ? "48px 20px" : "80px 48px",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ width: "48px", height: "1px", background: "var(--muted)", margin: "0 auto 32px" }} />
            <blockquote style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
              color: "var(--text)",
              margin: 0
            }}>
              "Own every room you enter — not with noise, but with presence."
            </blockquote>
            <div style={{ width: "48px", height: "1px", background: "var(--muted)", margin: "32px auto 0" }} />
          </div>
        </section>

      </main>

      <Footer />

      {/* ─── STICKY MOBILE BOTTOM BAR ─── */}
      {isMobile && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 20px",
          background: "var(--bg)",
          borderTop: "1px solid var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          zIndex: 50
        }}>
          <div>
            <p style={{ fontSize: "0.7rem", color: "var(--muted)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Price</p>
            <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)", margin: 0 }}>₹{displayPrice.toLocaleString("en-IN")}</p>
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              maxWidth: "200px",
              height: "52px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: addedCart ? "var(--primary)" : "var(--accent)",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s ease, transform 0.15s ease",
              whiteSpace: "nowrap"
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {addedCart ? "✓ Added to Bag" : "Add to Bag"}
          </button>
          <button
            onClick={handleBuyNow}
            style={{
              flex: 1,
              maxWidth: "120px",
              height: "52px",
              borderRadius: "var(--radius-md)",
              border: "2px solid var(--primary)",
              background: "transparent",
              color: "var(--text)",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 0.15s ease",
              whiteSpace: "nowrap"
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}