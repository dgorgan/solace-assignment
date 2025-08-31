import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const lato = Lato({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["300", "400", "700", "900"]
});
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${playfair.variable} font-sans bg-surface text-slate-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
