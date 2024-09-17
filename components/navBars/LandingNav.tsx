import Link from "next/link";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

function LandingNav() {
  return (
    <nav className="flex justify-between w-full max-w-4xl items-center py-4">
      <div title="logo" className="font-bold text-2xl">
        <Link href={"/"}>Ambi-Learn</Link>
      </div>
      <div title="nav buttons" className="flex gap-x-8">
        <SignedOut>
          <Button variant={"default"}>
            <SignInButton forceRedirectUrl={"/dashboard"} data-id="sign-in-button"/>
          </Button>
        </SignedOut>
        <SignedIn>
          <Link href={"/dashboard"}>
            <Button variant={"ghost"} data-id="dashboard-button">Dashboard</Button>
          </Link>
        </SignedIn>
      </div>
    </nav>
  );
}

export default LandingNav;
