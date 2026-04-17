import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCategories } from "@/lib/api";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["헤스티아", "HESTIA", "글루타치온", "화장품", "기미", "MELASMA-X", "스킨케어"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories().catch(() => []);

  return (
    <html lang="ko" className={`${cormorant.variable} ${dmSans.variable} ${notoSansKR.variable}`}>
      <body className="antialiased bg-hestia-cream text-hestia-dark min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
