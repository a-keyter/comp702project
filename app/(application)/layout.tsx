import Footer from "@/components/Footer";
import UserNav from "@/components/navBars/UserNav";
import { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Ambi-Learn",
  description:
    "Comp702 Project, exploring bi-directional personalised feedback.",
};

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen flex flex-col items-center w-full">
      <UserNav />
      <main className="flex-grow flex flex-col items-center w-full mb-1 px-4">
        <Suspense fallback={<Loading />}>
        {children}
        </Suspense>
      </main>
      <Footer />
    </main>
  );
}
