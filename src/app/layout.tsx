import type { Metadata } from "next";
import { Inter, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { APP_URL } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Workly — Find your next workspace. Fill your next desk.",
    template: "%s · Workly",
  },
  description:
    "Workly matches growing teams with flexible offices and coworking spaces, and sends operators high-intent, qualified leads.",
  openGraph: {
    title: "Workly",
    description:
      "Find your next workspace. Fill your next desk. The marketplace connecting teams with coworking operators.",
    siteName: "Workly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workly",
    description: "Find your next workspace. Fill your next desk.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
