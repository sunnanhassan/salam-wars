import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090d16",
};

export const metadata: Metadata = {
  title: "Salam Wars – The Ultimate Scoreboard",
  description: "A fun, friendly competition scoreboard between Sunnan and Alina. 1973 Salam Constitution Championship.",
  keywords: ["Salam Wars", "Scoreboard", "Sunnan", "Alina", "1973 Constitution"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
