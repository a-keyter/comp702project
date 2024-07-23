import Link from "next/link";
import { Button } from "./ui/button";
import { Clipboard, StopCircle, User, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";

function UserNav() {
  return (
    <nav className="flex justify-between w-full max-w-4xl items-center py-4 border-b-slate-300 border-b-2 mb-4">
      <div title="logo" className="font-bold text-2xl">
        <Link href={"/dashboard"}>Ambi-Learn</Link>
      </div>
      <div title="nav buttons" className="flex gap-x-4">
        <Link href={"/classes"}>
          <Button variant={"ghost"} className="flex flex-col">
            <div>
              <Users />
            </div>
            Classes
          </Button>
        </Link>
        <Link href={"/assessments"}>
          <Button variant={"ghost"} className="flex flex-col ">
            <div>
              <Clipboard />
            </div>{" "}
            Assessments
          </Button>
        </Link>
        <Link href={"/feedback"}>
          <Button variant={"ghost"} className="flex flex-col ">
            <div>
              <StopCircle />
            </div>
            Feedback
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="flex flex-col ">
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
              <Link href={"/profile"} className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/dashboard"} className="w-full">Dashboard</Link>
            </DropdownMenuItem>
           
            <DropdownMenuItem>
              <SignOutButton redirectUrl={"/"}/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default UserNav;
