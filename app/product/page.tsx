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

const categories = [
  { label: "Everyday Essentials", img: "/product-1.jpg" },
  { label: "Morning Ritual", img: "/product-1.jpg" },
  { label: "Signature Collection", img: "/product-1.jpg" },
  { label: "Gift Sets", img: "/product-1.jpg" },
  { label: "New Arrivals", img: "/product-1.jpg" },
];

const relatedProducts = [
  { id: 1, img: "/product-1.jpg", name: "Hi", price: 499, badge: "NEW" },
  { id: 2, img: "/product-1.jpg", name: "Hi Studio", price: 699, badge: "" },
  { id: 3, img: "/product-1.jpg", name: "Hi Select", price: 899, badge: "BESTSELLER" },
  { id: 4, img: "/product-1.jpg", name: "Hi Luxe", price: 1299, badge: "" },
];

function StarRow({ count }: { count: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= count ? "var(--accent)" : "none"} stroke={i <= count ? "var(--accent)" : "var(--muted)"} strokeWidth="1.5">
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

  const displayImg   = paramImg   ?? "/product-1.jpg";
  const displayName  = paramName  ?? "Hi";
  const displayPrice = paramPrice ?? 499;

  const matchedProduct = allProducts.find(p => p.name === displayName) ?? allProducts[0];
  const specs = matchedProduct.specs;

  const [quantity, setQuantity]   = useState(1);
  const [addedCart, setAddedCart] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .will-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease-out, transform 0.65s ease-out; }
      .will-reveal.visible { opacity: 1; transform: translateY(0); }
      .cat-rail::-webkit-scrollbar { display: none; }
      .cat-rail { -ms-overflow-style: none; scrollbar-width: none; }
      .reviews-rail::-webkit-scrollbar { display: none; }
      .reviews-rail { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach(el => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver((entries) => entries.forEach(e => {
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

      {/* ══════════════════════════════════════════
          HERO — SPLIT_TEXT_LEFT  60/40 full-height
         ══════════════════════════════════════════ */}
      <section style={{
        paddingTop: "72px", /* navbar offset */
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "60fr 40fr",
        minHeight: isMobile ? "auto" : "100vh",
        alignItems: "stretch",
        overflow: "hidden"
      }}>

        {/* Left — text column */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "48px 24px 40px" : "80px 64px 80px 80px",
          gap: "32px"
        }}>
          {/* Eyebrow */}
          <p style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "var(--accent)",
            margin: 0
          }}>
            Hi Studio — Own Every Room
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--text)",
            margin: 0
          }}>
            Elevate<br />Your<br />Every Day.
          </h1>

          {/* Descriptor */}
          <p style={{
            fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
            lineHeight: 1.7,
            color: "var(--muted)",
            margin: 0,
            maxWidth: "420px"
          }}>
            Quiet confidence in every use. Designed for the urban Indian who demands simplicity and substance — no noise, no excess.
          </p>

          {/* Price + Rating */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px" }}>
            <span style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "var(--font-heading)"
            }}>
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", color: "var(--muted)" }}>
              <StarRow count={5} />
              <span>4.8 · 214 reviews</span>
            </div>
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.8rem", color: "var(--muted)" }}>
            {["Free delivery above ₹499", "Made in India", "25,000+ happy customers"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </span>
            ))}
          </div>

          {/* Quantity + CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "360px" }}>
            {/* Qty */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid var(--muted)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              height: "48px",
              width: "fit-content"
            }}>
              <button onClick={decQty} style={{ width: "48px", height: "48px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Decrease">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span style={{ width: "48px", textAlign: "center", fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>{quantity}</span>
              <button onClick={incQty} style={{ width: "48px", height: "48px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Increase">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>

            {/* Add to bag */}
            <button
              onClick={handleAddToCart}
              style={{
                height: "60px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: addedCart ? "var(--muted)" : "var(--accent)",
                color: "#0E0C14",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "transform 0.15s ease, background 0.2s ease"
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              {addedCart ? "✓ Added to Bag" : "Add to Bag"}
            </button>

            {/* Buy now */}
            <button
              onClick={handleBuyNow}
              style={{
                height: "60px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--primary)",
                background: "transparent",
                color: "var(--text)",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Right — full-bleed product image, no border-radius, bleeds to edge */}
        <div style={{
          overflow: "hidden",
          position: "relative",
          minHeight: isMobile ? "60vw" : "100%"
        }}>
          <img
            src={displayImg}
            alt={displayName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
              transition: "transform 0.7s ease"
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
          {/* Subtle gradient scrim at bottom */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)",
            pointerEvents: "none"
          }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORY STRIP — HORIZONTAL_RAIL
         ══════════════════════════════════════════ */}
      <section className="reveal" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingLeft: isMobile ? "24px" : "80px" }}>
          <p style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "var(--accent)",
            marginBottom: "24px"
          }}>
            Shop by Category
          </p>
        </div>
        <div
          className="cat-rail"
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: isMobile ? "24px" : "80px",
            paddingRight: isMobile ? "24px" : "80px",
            paddingBottom: "8px"
          }}
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => router.push("/shop")}
              style={{
                flex: "0 0 auto",
                width: isMobile ? "56vw" : "220px",
                scrollSnapAlign: "start",
                cursor: "pointer"
              }}
            >
              <div style={{
                overflow: "hidden",
                borderRadius: "var(--radius-sm)",
                aspectRatio: "1/1",
                background: "color-mix(in srgb, var(--surface) 20%, var(--bg))"
              }}>
                <img
                  src={cat.img}
                  alt={cat.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s ease"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <p style={{
                marginTop: "12px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--text)",
                letterSpacing: "0.01em"
              }}>
                {cat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STORY SPLIT — ASYMMETRIC_SPLIT (no card-in-card)
         ══════════════════════════════════════════ */}
      <section id="story" className="reveal" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "55fr 45fr",
          gap: 0,
          alignItems: "stretch",
          maxWidth: "100%",
          overflow: "hidden"
        }}>
          {/* Text side */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "48px 24px" : "80px 64px 80px 80px",
            gap: "24px"
          }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--accent)", margin: 0 }}>
              Our Story
            </p>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text)",
              margin: 0
            }}>
              Built for the bold.<br />Made for every day.
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", margin: 0, maxWidth: "400px" }}>
              Hi was born out of frustration with the ordinary. We stripped away everything unnecessary and left only what works — products that keep up with the pace of modern Indian life without asking you to slow down.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", margin: 0, maxWidth: "400px" }}>
              Every formula is tested. Every pack is considered. Every price is honest. That's the Hi standard.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{
                alignSelf: "flex-start",
                padding: "16px 40px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "var(--accent)",
                color: "#0E0C14",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Discover Products
            </button>
          </div>

          {/* Image side — full-bleed, no border-radius, no container */}
          <div style={{
            overflow: "hidden",
            minHeight: isMobile ? "60vw" : "560px"
          }}>
            <img
              src={displayImg}
              alt="Hi product story"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                transition: "transform 0.7s ease"
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BRAND MANIFESTO — full-bleed dark, left-aligned
         ══════════════════════════════════════════ */}
      <section className="reveal" style={{
        background: "#1a1814",
        padding: isMobile ? "64px 24px" : "96px 80px"
      }}>
        {/* 3px accent rule */}
        <div style={{ width: "56px", height: "3px", background: "var(--accent)", marginBottom: "40px" }} />
        <blockquote style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          color: "var(--text)",
          margin: 0,
          maxWidth: "900px"
        }}>
          "You don't need more — you need better. That's what Hi has always been about."
        </blockquote>
        <p style={{
          marginTop: "32px",
          fontSize: "0.875rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted)"
        }}>
          — Rahul Mehta, Founder, Hi Studio
        </p>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE TRIO — BENTO_MOSAIC  2fr 1fr 1fr
         ══════════════════════════════════════════ */}
      <section className="reveal" style={{ padding: isMobile ? "64px 24px" : "80px 80px", maxWidth: "1440px", margin: "0 auto" }}>
        <p style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          color: "var(--accent)",
          marginBottom: "40px"
        }}>
          The Hi Promise
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr",
          gap: "16px",
          gridAutoRows: "minmax(220px, auto)"
        }}>
          {/* Big tile — accent background, large icon */}
          <div style={{
            background: "var(--accent)",
            borderRadius: "var(--radius-lg)",
            padding: isMobile ? "40px 32px" : "56px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: "20px",
            gridRow: isMobile ? undefined : "span 2",
            minHeight: "340px"
          }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#0E0C14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 700,
                color: "#0E0C14",
                margin: "0 0 12px",
                lineHeight: 1.1
              }}>
                Quality<br />Guaranteed
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(14,12,20,0.75)", margin: 0 }}>
                Every batch tested. Every formula backed. We don't ship what we wouldn't use ourselves.
              </p>
            </div>
          </div>

          {/* Tile 2 */}
          <div style={{
            background: "color-mix(in srgb, var(--surface) 15%, var(--bg))",
            borderRadius: "var(--radius-lg)",
            padding: "40px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "200px",
            border: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)"
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <div>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--text)",
                margin: "0 0 10px",
                lineHeight: 1.2
              }}>
                Minimal Packaging
              </h3>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
                Less waste. More intention. Our packaging uses 80% recycled materials.
              </p>
            </div>
          </div>

          {/* Tile 3 */}
          <div style={{
            background: "color-mix(in srgb, var(--surface) 15%, var(--bg))",
            borderRadius: "var(--radius-lg)",
            padding: "40px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "200px",
            border: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)"
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--text)",
                margin: "0 0 10px",
                lineHeight: 1.2
              }}>
                No Compromises
              </h3>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
                Transparent ingredients. No hidden fillers. What you see is exactly what you get.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SPECS (if any)
         ══════════════════════════════════════════ */}
      {specs.length > 0 && (
        <section className="reveal" style={{ padding: isMobile ? "48px 24px" : "80px 80px", maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "32px" }}>
            Specifications
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px 40px" }}>
            {specs.map(s => (
              <div key={s.label} style={{ borderTop: "1px solid color-mix(in srgb, var(--muted) 25%, transparent)", paddingTop: "16px" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          REVIEWS — HORIZONTAL_RAIL
         ══════════════════════════════════════════ */}
      <section className="reveal" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingLeft: isMobile ? "24px" : "80px", paddingRight: isMobile ? "24px" : "80px", marginBottom: "32px" }}>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--text)",
            margin: 0
          }}>
            What they're saying
          </h2>
        </div>
        <div
          className="reviews-rail"
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: isMobile ? "24px" : "80px",
            paddingRight: isMobile ? "24px" : "80px",
            paddingBottom: "8px"
          }}
        >
          {reviews.map((r, i) => (
            <div key={i} style={{
              flex: "0 0 auto",
              width: isMobile ? "80vw" : "340px",
              scrollSnapAlign: "start",
              background: "color-mix(in srgb, var(--surface) 12%, var(--bg))",
              border: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <StarRow count={r.stars} />
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text)", margin: 0, fontStyle: "italic" }}>
                "{r.text}"
              </p>
              <div style={{ marginTop: "auto" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", margin: "0 0 2px" }}>{r.name}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>{r.city} · {r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          YOU MIGHT ALSO LIKE — product grid
         ══════════════════════════════════════════ */}
      <section className="reveal" style={{ padding: isMobile ? "64px 24px" : "80px 80px", maxWidth: "1440px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "var(--text)",
          marginTop: 0,
          marginBottom: "40px"
        }}>
          You might also like
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px"
        }}>
          {relatedProducts.map(p => (
            <article
              key={p.id}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              style={{ cursor: "pointer" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div style={{ overflow: "hidden", borderRadius: "var(--radius-lg)", background: "color-mix(in srgb, var(--surface) 12%, var(--bg))", marginBottom: "16px", position: "relative" }}>
                {p.badge && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "var(--accent)",
                    color: "#0E0C14",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-pill)",
                    zIndex: 2
                  }}>
                    {p.badge}
                  </div>
                )}
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.7s ease"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <h3 style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--text)", margin: "0 0 6px" }}>{p.name}</h3>
              <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1rem", margin: 0 }}>₹{p.price.toLocaleString("en-IN")}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER — clear input borders
         ══════════════════════════════════════════ */}
      <section className="reveal" style={{
        background: "color-mix(in srgb, var(--surface) 10%, var(--bg))",
        padding: isMobile ? "64px 24px" : "96px 80px",
        borderTop: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)"
      }}>
        <div style={{ maxWidth: "560px" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "16px" }}>
            Stay in the loop
          </p>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--text)",
            margin: "0 0 16px"
          }}>
            Early access.<br />No noise.
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", margin: "0 0 32px" }}>
            New drops, restocks, and insider updates — straight to your inbox. No spam, ever.
          </p>
          {subscribed ? (
            <p style={{ fontSize: "1rem", color: "var(--accent)", fontWeight: 600 }}>✓ You're in. Watch your inbox.</p>
          ) : (
            <div style={{ display: "flex", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{
                  flex: 1,
                  height: "56px",
                  padding: "0 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid #1a1814",
                  background: "#ffffff",
                  color: "#0E0C14",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "var(--font-body)"
                }}
              />
              <button
                onClick={() => { if (email) setSubscribed(true); }}
                style={{
                  height: "56px",
                  padding: "0 32px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "var(--text)",
                  color: "#0E0C14",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "transform 0.15s ease"
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* ══════════════════════════════════════════
          STICKY MOBILE CTA BAR
         ══════════════════════════════════════════ */}
      {isMobile && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          background: "var(--bg)",
          borderTop: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          zIndex: 50
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)" }}>Price</p>
            <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)" }}>
              ₹{displayPrice.toLocaleString("en-IN")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flex: 1 }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                height: "52px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--primary)",
                background: "transparent",
                color: "var(--text)",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              {addedCart ? "✓ Added" : "Add to Bag"}
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                flex: 1,
                height: "52px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "var(--accent)",
                color: "#0E0C14",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>Loading…</p>
      </div>
    }>
      <ProductContent />
    </Suspense>
  );
}