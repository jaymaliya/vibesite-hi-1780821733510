import type { Metadata } from "next";
import CartProvider from "../components/CartContext";
import Toast from "../components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hi",
  description: "Premium D2C Store",
  openGraph: { title: "Hi", description: "Shop Hi online", type: "website", images: ["/product-1.jpg"] },
  twitter: { card: "summary_large_image", title: "Hi" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZwogICAgICAgICAgICB3aWR0aD0iNDgiCiAgICAgICAgICAgIGhlaWdodD0iMzIiCiAgICAgICAgICAgIHZpZXdCb3g9IjAgMCA0OCAzMiIKICAgICAgICAgICAgZmlsbD0ibm9uZSIKICAgICAgICAgICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgICAgICAgICBhcmlhLWhpZGRlbj0idHJ1ZSIKICAgICAgICAgID4KICAgICAgICAgICAgPHRleHQKICAgICAgICAgICAgICB4PSIwIgogICAgICAgICAgICAgIHk9IjI4IgogICAgICAgICAgICAgIHN0eWxlPXt9CiAgICAgICAgICAgID4KICAgICAgICAgICAgICBIaQogICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICA8L3N2Zz4=" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: "try{if(location.search.indexOf('screenshot=1')>-1){var s=document.createElement('style');s.textContent='*{animation:none!important;transition:none!important}.will-reveal,.is-hidden,[class*=reveal],[class*=fade]{opacity:1!important;transform:none!important;visibility:visible!important}';document.head.appendChild(s);}}catch(e){}" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Hi", logo: "/product-1.jpg", url: process.env.VAANI_SITE_URL || undefined }) }} />
      </head>
      <body>
        <CartProvider>
          <Toast />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
