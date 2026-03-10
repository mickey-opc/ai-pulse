import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
