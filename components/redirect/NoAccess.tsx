"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NoAccessRedirect({
  redirectTo,
}: {
  redirectTo: string;
}) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push(redirectTo);
    }, 2000);
  }, [router, redirectTo]);

  return (
    <div className="flex flex-1 max-w-4xl justify-center items-center">
      You do not have access to this page or the data it contains, you will be
      redirected.{" "}
      <div className="pl-4">
        <LoadingSpinner />
      </div>
    </div>
  );
}


