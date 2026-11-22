import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/context/ScrollContext";
import { GlassNavbar } from "@/components/ui/GlassNavbar";
import { FullscreenMenu } from "@/components/ui/FullscreenMenu";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { PERSONAL_INFO } from "@/data/content";
import { SITE_URL, SITE_CONFIG } from "@/config/site";

/* ─── NEXT.JS LUXURY EDITORIAL FONTS ─── */
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  style: ["normal", "italic"],
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Krish Prajapati | Computer Engineer & Builder",
    template: "%s | Krish Prajapati",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Krish Prajapati",
    "Computer Engineering",
    "DJSCE",
    "Mumbai",
    "Machine Learning",
    "Flutter",
    "Full-Stack Developer",
    "Portfolio",
    "Python",
    "TensorFlow",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.links.github }],
  creator: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Krish Prajapati | Computer Engineer & Builder",
    description: SITE_CONFIG.description,
    url: SITE_URL,
    siteName: "Krish Prajapati Portfolio",
    locale: SITE_CONFIG.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Prajapati | Computer Engineer & Builder",
    description: SITE_CONFIG.description,
    creator: "@Krishu-1304",
  },
};

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Krish Prajapati",
    jobTitle: "Computer Engineering Student",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
    },
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressCountry: "IN",
    },
    sameAs: [
      SITE_CONFIG.links.github,
      SITE_CONFIG.links.linkedin,
    ],
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-ivory text-charcoal font-sans antialiased overflow-x-hidden min-h-screen selection:bg-gold selection:text-softblack">
        <ScrollProvider>
          {/* Subtle Depth Background Elements */}
          <div className="grid-lines" aria-hidden="true" />
          <div className="vignette" aria-hidden="true" />
          <div className="film-grain" aria-hidden="true" />
          <div id="ambient-glow" className="ambient-glow" aria-hidden="true" />

          {/* Custom cursor (desktop only) */}
          <CustomCursor />

          {/* Rolling loader */}
          <Preloader />

          {/* Floating glass pill navbar */}
          <GlassNavbar />

          {/* Fullscreen menu overlay */}
          <FullscreenMenu />

          {/* Project detail modal */}
          <ProjectModal />

          <main className="relative z-10">{children}</main>
        </ScrollProvider>
      </body>
    </html>
  );
}
