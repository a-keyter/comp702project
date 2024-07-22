import LandingNav from "@/components/LandingNav";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full gap-y-8">
      <LandingNav/>
      <div className="w-full max-w-4xl bg-blue-400 h-20">Big Blue Box</div>
    </main>
  );
}
