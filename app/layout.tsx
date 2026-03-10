import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Pulse",
  description: "Global AI news pulse for Twitter, waytoagi, OpenAI, and Anthropic."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
