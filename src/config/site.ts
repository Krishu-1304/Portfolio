/**
 * Site configuration and canonical URLs
 *
 * TODO: Replace the fallback domain below with your actual deployed Vercel domain or custom domain
 * (e.g., "https://krishprajapati.vercel.app" or "https://krishprajapati.com")
 * Or configure the NEXT_PUBLIC_SITE_URL environment variable in your Vercel project settings.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

export const SITE_CONFIG = {
  name: "Krish Prajapati",
  title: "Krish Prajapati | Computer Engineer & Builder",
  description:
    "Portfolio of Krish Prajapati, a Computer Engineering student building ML-powered apps, Flutter mobile apps and full-stack products.",
  url: SITE_URL,
  locale: "en_IN",
  themeColor: "#F1E9DF", // Matching ivory / cream theme
  links: {
    github: "https://github.com/Krishu-1304",
    linkedin: "https://www.linkedin.com/in/krish-prajapati-37a741388",
    email: "prajapatikrish816@gmail.com",
  },
};
