
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VYBE — Your people. Your world.",
  description:
    "Connect, discover communities and share your world with VYBE."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
