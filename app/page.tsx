import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full gap-y-16 ">
      <LandingNav />
      <div className="w-full max-w-4xl flex gap-x-8">
        <div className="w-full flex flex-col gap-y-8">
          <h2 className="font-bold text-2xl">Welcome to Ambi-Learn.</h2>
          <p>The perfect environment for learning.</p>
        </div>
        <div className="w-full bg-pink-300 h-80 text-center"><p>Image Placeholder</p></div>
      </div>
      <div className="flex-1"></div>
      <Footer/>
    </main>
  );
}
