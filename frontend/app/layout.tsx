import type { Metadata, Viewport } from "next";
import "./globals.css";
import OfflineIndicator from "./components/OfflineIndicator";

export const viewport: Viewport = {
  themeColor: "#86A789",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Emotion Analysis - AI-Powered Mental Health Insights",
  description: "Analyze your thoughts and emotions with AI. Track patterns, gain insights, and improve mental well-being.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="antialiased">
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}

