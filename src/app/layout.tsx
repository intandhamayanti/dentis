import type { Metadata } from "next";
import { Bricolage_Grotesque, Playfair_Display } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-playfair",
  display: "swap",
});

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://dentis.id";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "dentis. - Klinik Gigi Spesialis & Estetika Presisi",
  description:
    "Perawatan gigi modern minim rasa sakit dengan teknologi digital presisi, dokter spesialis terpercaya, dan suasana privat yang tenang.",
  applicationName: "dentis.",
  authors: [{ name: "dentis. Dental Clinic" }],
  keywords: [
    "klinik gigi",
    "dokter gigi spesialis",
    "behel gigi",
    "clear aligners",
    "implan gigi",
    "veneer gigi",
    "pemutihan gigi",
    "dentis",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "dentis.",
    title: "dentis. - Klinik Gigi Spesialis & Estetika Presisi",
    description:
      "Perawatan gigi modern minim rasa sakit dengan teknologi digital presisi, dokter spesialis terpercaya, dan suasana privat yang tenang.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "dentis. - Klinik Gigi Spesialis & Estetika Presisi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dentis. - Klinik Gigi Spesialis & Estetika Presisi",
    description:
      "Perawatan gigi modern minim rasa sakit dengan teknologi digital presisi, dokter spesialis terpercaya, dan suasana privat yang tenang.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${bricolage.variable} ${playfair.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#F3F5F4] text-[#1E293B] font-sans selection:bg-[#0D5966] selection:text-white">
        {children}
      </body>
    </html>
  );
}
