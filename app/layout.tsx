import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ambi-Learn",
  description:
    "Comp702 Project, exploring bi-directional personalised feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className + " bg-gray-200"}>
          <div>
          {children}
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
