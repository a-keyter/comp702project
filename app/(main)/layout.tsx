import Footer from "@/components/Footer";
import UserNav from "@/components/UserNav";
import { Metadata } from "next";

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
    <main className="h-screen flex flex-col items-center w-full gap-y-6">
      <UserNav />
      <main className="flex-grow flex flex-col items-center w-full gap-y-6">
        {children}
      </main>
      <Footer />
    </main>
  );
}
