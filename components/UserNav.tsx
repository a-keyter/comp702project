"use server"

import Link from "next/link";
import { Button } from "./ui/button";
import { Clipboard, Home, StopCircle, User, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function UserNav() {
  const {userId} = auth()

  if (!userId) {
    redirect("/")
  }

  const user = await getUserById(userId);

  if (!user) {
    redirect("/onboard")
  }

  const userRole = user?.role.charAt(0).toUpperCase() + user?.role.slice(1).toLowerCase()

  return (
    <nav className="flex justify-between w-full max-w-4xl items-center pt-4 pb-2 mb-1 pl-4 pr-3 lg:px-0">
      <div title="logo" className="font-bold text-2xl">
        <Link href={"/dashboard"}>Ambi-Learn - {userRole}</Link>
      </div>
      <div className="flex">
        <Link href={"/classes"}>
          <Button variant={"ghost"} className="flex flex-col px-2">
            <div>
              <Users />
            </div>
            Classes
          </Button>
        </Link>
        <Link href={"/assessments"}>
          <Button variant={"ghost"} className="flex flex-col px-2">
            <div>
              <Clipboard />
            </div>{" "}
            Tests
          </Button>
        </Link>
        <Link href={"/issues"}>
          <Button variant={"ghost"} className="flex flex-col px-2">
            <div>
              <StopCircle />
            </div>
            Issues
          </Button>
        </Link>
       
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="flex flex-col px-2">
              <div>
                <User />
              </div>
              Profile
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/profile"} className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/dashboard"} className="w-full">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SignOutButton redirectUrl={"/"} >
                <button className="w-full text-left">Sign out</button>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href={"/dashboard"}>
          <Button variant={"ghost"} className="flex flex-col px-2">
            <div>
              <Home />
            </div>
            Home
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default UserNav;
