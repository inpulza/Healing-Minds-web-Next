import type { Metadata } from "next";
import { Instrument_Sans, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "@/index.css";
import Providers from "./providers";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.healingmindsp.com"),
  title: "Expert Psychiatric Care in Naples, FL | Healing Minds Psychiatry",
  description:
    "Compassionate psychiatric care for anxiety, depression, ADHD, PTSD and medication management in Naples, Florida.",
  other: {
    "healing-build-sha":
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.GITHUB_SHA ||
      "local",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = (await headers()).get("x-healing-pathname") || "/";
  const language = pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";

  return (
    <html
      lang={language}
      data-metadata-owner="next"
      className={`${instrumentSans.variable} ${playfairDisplay.variable}`}
    >
      <body>
        <Providers initialLanguage={language}>{children}</Providers>
      </body>
    </html>
  );
}
