import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";

function page() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full gap-y-16">
      <LandingNav />
      <p>Welcome to the About Page.</p>
      <div className="flex-1"></div>
      <Footer/>
    </main>
  );
}

export default page;
