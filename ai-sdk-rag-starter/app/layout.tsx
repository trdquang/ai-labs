import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SideMenu } from "@/components/side-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI SDK RAG Starter",
  description: "AI SDK examples with RAG capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <SideMenu />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
