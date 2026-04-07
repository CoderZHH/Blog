import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZHH Blog",
  description: "A cinematic personal blog built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
