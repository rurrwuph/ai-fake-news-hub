import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Fake News Hub — Fact-Checking & Verification Platform",
  description:
    "A Fact-Checking, Hallucination Detection & AI Verification Platform powered by the VeritasAI Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}

