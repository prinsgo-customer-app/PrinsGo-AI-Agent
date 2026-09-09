import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrinsGo AI Agent",
  description: "Your Intelligent Digital Workforce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="h-full flex flex-col bg-brand-white text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
