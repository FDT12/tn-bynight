// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tunisia Nightlife Heat Map",
  description: "Interactive heat map showing nightlife activity across Tunisia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="text-center p-4 text-sm text-gray-600 border-t">
          <p>Web Services Course Project - Tunisia Nightlife API</p>
          <p>Data sourced from teskerti.tn | Map: @react-map/tunisia</p>
        </footer>
      </body>
    </html>
  );
}