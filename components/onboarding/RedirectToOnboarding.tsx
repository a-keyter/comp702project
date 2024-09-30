"use client"

import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectToOnboarding() {
    const router = useRouter();
    
    useEffect(() => {
      router.push('/onboard');
    }, [router]);
  
    return (
      <div className="flex flex-1 max-w-4xl justify-center items-center">
        Please wait whilst we initialise your profile... <div className="pl-4"><LoadingSpinner/></div>
      </div>
    );
  }