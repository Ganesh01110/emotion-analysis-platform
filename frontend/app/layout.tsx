import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emotion Analysis - AI-Powered Mental Health Insights",
  description: "Analyze your thoughts and emotions with AI. Track patterns, gain insights, and improve mental well-being.",
  manifest: "/manifest.json",
  themeColor: "#86A789",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
        {children}
      </body>
    </html>
  );
}

