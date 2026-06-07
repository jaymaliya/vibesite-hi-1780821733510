"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], removeItem, updateQuantity, clearCart } = useCart() ?? {};

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [payData, setPayData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .reveal { opacity: 1; transform: translateY(0); }
      .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .will-reveal.visible { opacity: 1; transform: translateY(0); }
      .form-input:focus { outline: none; border-color: var(--accent) !important; }
      .remove-btn:hover { color: var(--accent) !important; }
      .qty-btn:hover { background: var(--surface) !important; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) el.classList.add("will-reveal");
      else el.classList.add("visible");
    });
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove("will-reveal");
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }), { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email required";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errs.phone = "10-digit phone number required";
    if (!address.trim()) errs.address = "Address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) errs.pin = "6-digit PIN code required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function payNow() {
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [{ supportedMethods: "https://tez.google.com/pay", data: { pa: payData.upiId, tr: payData.orderId, am: String(payData.amount), cu: "INR" } }],
          { total: { label: "Total", amount: { currency: "INR", value: String(payData.amount) } } }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function handleProceed(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch {
      setPaying(false);
    }
  }

  async function handleConfirm() {
    if (!payData) return;
    setConfirming(true);
    try {
      await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "Hi",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      clearCart?.();
    } catch {
      setConfirming(false);
    }
  }

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "var(--radius-sm)",
    border: `1.5px solid ${errors[field] ? "var(--accent)" : "color-mix(in srgb, var(--muted) 40%, transparent)"}`,
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    lineHeight: "1.5",
    transition: "border-color 0.2s ease",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "var(--muted)",
    marginBottom: "6px",
    fontFamily: "var(--font-body)",
  };

  if (items.length === 0 && !paid) {
    return (
      <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "16px" }}>
            Your bag is empty.
          </p>
          <p style={{ color: "var(--muted)", fontSize: "16px", marginBottom: "40px", lineHeight: "1.6" }}>
            Looks like you haven't added anything yet.
          </p>
          <button
            onClick={() => router.push("/shop")}
            style={{ padding: "16px 40px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", transition: "transform 0.15s ease", whiteSpace: "nowrap" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Start Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* Page header */}
      <section
        className="reveal"
        style={{ paddingTop: "120px", paddingBottom: "48px", paddingLeft: "clamp(20px, 5vw, 80px)", paddingRight: "clamp(20px, 5vw, 80px)", maxWidth: "1280px", margin: "0 auto" }}
      >
        <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)", marginBottom: "12px" }}>Checkout</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.1, color: "var(--text)", margin: 0 }}>
          Complete Your Order
        </h1>
      </section>

      {/* Main content */}
      <section
        className="reveal"
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 80px) 80px", boxSizing: "border-box" }}
      >
        <form
          onSubmit={handleProceed}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "40px", alignItems: "start" }}
        >
          {/* ── LEFT: Delivery form ── */}
          <div
            style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "clamp(24px, 4vw, 40px)", boxSizing: "border-box" }}
          >
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 400, color: "var(--text)", marginBottom: "32px", letterSpacing: "-0.01em" }}>
              Delivery Details
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Riya Agarwal"
                  style={inputStyle("name")}
                />
                {errors.name && <p style={{ color: "var(--accent)", fontSize: "12px", marginTop: "4px" }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="riya@example.com"
                  style={inputStyle("email")}
                />
                {errors.email && <p style={{ color: "var(--accent)", fontSize: "12px", marginTop: "4px" }}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  className="form-input"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  style={inputStyle("phone")}
                />
                {errors.phone && <p style={{ color: "var(--accent)", fontSize: "12px", marginTop: "4px" }}>{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label style={labelStyle}>Street Address</label>
                <textarea
                  className="form-input"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Flat 4B, Green Park Residency"
                  rows={2}
                  style={{ ...inputStyle("address"), resize: "none" }}
                />
                {errors.address && <p style={{ color: "var(--accent)", fontSize: "12px", marginTop: "4px" }}>{errors.address}</p>}
              </div>

              {/* City + State */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    className="form-input"
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Mumbai"
                    style={inputStyle("city")}
                  />
                  {errors.city && <p style={{ color: "var(--accent)", fontSize: "12px", marginTop: "4px" }}>{errors.city}</p>}
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input
                    className="form-input"
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="Maharashtra"
                    style={inputStyle("state")}
                  />
                  {errors.state && <p style={{ color: "var(--accent)", fontSize: "12px", marginTop: "4px" }}>{errors.state}</p>}
                </div>
              </div>

              {/* PIN */}
              <div>
                <label style={labelStyle}>PIN Code</label>
                <input
                  className="form-input"
                  type="text"
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="400001"
                  style={{ ...inputStyle("pin"), maxWidth: "180px" }}
                />
                {errors.pin && <p style={{ color: "var(--accent)", fontSize: "12px", marginTop: "4px" }}>{errors.pin}</p>}
              </div>
            </div>

            {/* Trust */}
            <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: `1px solid color-mix(in srgb, var(--muted) 25%, transparent)`, display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {[
                { icon: "🔒", text: "Secure checkout" },
                { icon: "📦", text: "Free shipping above ₹500" },
                { icon: "🇮🇳", text: "Made in India" },
              ].map((t, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>
                  <span style={{ fontSize: "14px" }}>{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "clamp(24px, 4vw, 40px)", boxSizing: "border-box" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 400, color: "var(--text)", marginBottom: "28px", letterSpacing: "-0.01em" }}>
                Order Summary
              </h2>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    {/* Product image */}
                    <div style={{ width: "72px", height: "72px", flexShrink: 0, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg)", border: `1px solid color-mix(in srgb, var(--muted) 20%, transparent)` }}>
                      <img
                        src={item.image}
                        alt={item.name || "Hi product"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "4px", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name || "Hi"}
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)", marginBottom: "10px" }}>
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                      {/* Qty stepper + remove */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        {/* Stepper */}
                        <div style={{ display: "flex", alignItems: "center", border: `1.5px solid color-mix(in srgb, var(--muted) 30%, transparent)`, borderRadius: "var(--radius-sm)", overflow: "hidden", height: "36px" }}>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                            style={{ width: "36px", height: "36px", border: "none", background: "transparent", cursor: "pointer", fontSize: "18px", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s ease", fontFamily: "var(--font-body)", flexShrink: 0 }}
                            aria-label="Decrease quantity"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 2" fill="none"><rect y="0" width="14" height="2" rx="1" fill="currentColor"/></svg>
                          </button>
                          <span style={{ width: "36px", textAlign: "center", fontSize: "14px", fontWeight: 600, color: "var(--text)", userSelect: "none", flexShrink: 0 }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity?.(item.id, item.quantity + 1)}
                            style={{ width: "36px", height: "36px", border: "none", background: "transparent", cursor: "pointer", fontSize: "18px", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s ease", fontFamily: "var(--font-body)", flexShrink: 0 }}
                            aria-label="Increase quantity"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect y="6" width="14" height="2" rx="1" fill="currentColor"/><rect x="6" y="0" width="2" height="14" rx="1" fill="currentColor"/></svg>
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeItem?.(item.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 500, padding: "4px 0", letterSpacing: "0.04em", transition: "color 0.15s ease", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}
                          aria-label="Remove item"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          Remove
                        </button>

                        {/* Line total */}
                        <span style={{ marginLeft: "auto", fontSize: "14px", fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap" }}>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: `color-mix(in srgb, var(--muted) 25%, transparent)`, marginBottom: "20px" }} />

              {/* Totals */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--muted)" }}>
                  <span>Subtotal</span>
                  <span style={{ color: "var(--text)", fontWeight: 500 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--muted)" }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? "#2a7a4a" : "var(--text)", fontWeight: 600 }}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p style={{ fontSize: "11px", color: "#2a7a4a", fontWeight: 500, letterSpacing: "0.04em" }}>
                    ✓ You qualify for free shipping
                  </p>
                )}
                <div style={{ height: "1px", background: `color-mix(in srgb, var(--muted) 25%, transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 700, color: "var(--text)" }}>
                  <span>Total</span>
                  <span style={{ color: "var(--accent)" }}>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={paying}
                style={{ width: "100%", boxSizing: "border-box", padding: "18px 24px", background: paying ? "var(--muted)" : "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 700, cursor: paying ? "not-allowed" : "pointer", letterSpacing: "0.05em", transition: "transform 0.15s ease", whiteSpace: "normal", wordBreak: "break-word", lineHeight: "1.4" }}
                onMouseEnter={e => { if (!paying) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => { if (!paying) e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={e => { if (!paying) e.currentTarget.style.transform = "scale(1.02)"; }}
              >
                {paying ? "Preparing payment…" : `Proceed to Pay — ₹${total.toLocaleString("en-IN")}`}
              </button>

              {/* Continue shopping */}
              <button
                type="button"
                onClick={() => router.push("/shop")}
                style={{ width: "100%", marginTop: "12px", padding: "14px 24px", background: "transparent", color: "var(--muted)", border: `1.5px solid color-mix(in srgb, var(--muted) 35%, transparent)`, borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.08em", transition: "transform 0.15s ease, border-color 0.2s ease", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--muted)"; e.currentTarget.style.transform = "scale(1.01)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `color-mix(in srgb, var(--muted) 35%, transparent)`; e.currentTarget.style.transform = "scale(1)"; }}
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Payment methods note */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--radius-md)", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", whiteSpace: "nowrap" }}>Pay via</span>
              {["UPI", "GPay", "PhonePe", "Paytm"].map((method) => (
                <span key={method} style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", background: "var(--bg)", border: `1px solid color-mix(in srgb, var(--muted) 20%, transparent)`, borderRadius: "4px", padding: "4px 10px", whiteSpace: "nowrap" }}>
                  {method}
                </span>
              ))}
            </div>
          </div>
        </form>
      </section>

      {/* ── UPI PAYMENT OVERLAY ── */}
      {payData && !paid && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(30,28,24,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}
        >
          <div
            style={{ background: "var(--bg)", borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%", boxSizing: "border-box", boxShadow: "var(--shadow-xl)" }}
          >
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.01em" }}>Hi</span>
              <button
                onClick={() => { setPayData(null); setPaying(false); setPaymentLaunched(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}
                aria-label="Close payment"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Amount */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--muted)", marginBottom: "8px" }}>Amount to Pay</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", fontWeight: 400, color: "var(--accent)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                ₹{payData.amount?.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Mobile: deep link button / Desktop: QR */}
            {isMobile ? (
              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <button
                  onClick={payNow}
                  style={{ width: "100%", padding: "18px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em", transition: "transform 0.15s ease", marginBottom: "8px" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Pay ₹{payData.amount?.toLocaleString("en-IN")} Now
                </button>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>Opens Google Pay · PhonePe · Paytm</p>
                {paymentLaunched && (
                  <p style={{ fontSize: "13px", color: "#2a7a4a", fontWeight: 600, background: "var(--bg)", borderRadius: "6px", padding: "8px 12px" }}>
                    Payment app opened — confirm below once done
                  </p>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                {payData.qrBase64 ? (
                  <div style={{ display: "inline-block", padding: "12px", background: "#fff", borderRadius: "8px", border: `1px solid color-mix(in srgb, var(--muted) 20%, transparent)` }}>
                    <img src={`data:image/png;base64,${payData.qrBase64}`} width={180} height={180} alt="UPI QR code" style={{ display: "block" }} />
                  </div>
                ) : (
                  <div style={{ width: 180, height: 180, background: "var(--surface)", borderRadius: "8px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "var(--muted)", fontSize: "13px" }}>QR loading…</span>
                  </div>
                )}
                <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "10px" }}>Scan with any UPI app</p>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: "1px", background: `color-mix(in srgb, var(--muted) 20%, transparent)`, marginBottom: "20px" }} />

            {/* Confirm section */}
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "10px" }}>
              Confirm Payment
            </p>
            <input
              type="text"
              value={upiTxnId}
              onChange={e => setUpiTxnId(e.target.value)}
              placeholder="UPI Transaction ID (optional)"
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "var(--radius-sm)", border: `1.5px solid color-mix(in srgb, var(--muted) 30%, transparent)`, background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "14px", marginBottom: "12px", outline: "none" }}
            />
            <button
              onClick={handleConfirm}
              disabled={confirming}
              style={{ width: "100%", padding: "16px", background: confirming ? "var(--muted)" : "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, cursor: confirming ? "not-allowed" : "pointer", letterSpacing: "0.05em", transition: "transform 0.15s ease" }}
              onMouseEnter={e => { if (!confirming) e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              {confirming ? "Confirming…" : "I've Paid — Confirm Order"}
            </button>
          </div>
        </div>
      )}

      {/* ── SUCCESS OVERLAY ── */}
      {paid && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(30,28,24,0.8)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}
        >
          <div
            style={{ background: "var(--bg)", borderRadius: "20px", padding: "40px 32px", maxWidth: "420px", width: "100%", boxSizing: "border-box", textAlign: "center", boxShadow: "var(--shadow-xl)" }}
          >
            <div style={{ width: "64px", height: "64px", background: "var(--bg)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 14l7 7 11-11" stroke="#2a7a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "8px" }}>
              Order Confirmed!
            </h2>
            {payData && (
              <p style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "12px" }}>
                Order #{payData.orderId?.slice(-8)}
              </p>
            )}
            <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: "1.65", marginBottom: "32px" }}>
              Thank you, {name || "friend"}. We'll ship your order soon and send tracking details to your email.
            </p>
            <button
              onClick={() => router.push("/")}
              style={{ width: "100%", padding: "16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em", transition: "transform 0.15s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}