import { Card } from "@/components/ui/card";
import React from "react";

function page() {
  return (
    <div className="flex flex-col h-screen w-full gap-y-4 items-center justify-center">
      <Card className="flex flex-col gap-y-4 p-8 w-full max-w-md text-center text-balance">
        <h2 className="font-semibold text-xl">Welcome to Ambi-Learn!</h2>
        <p>
          This web application is currently in development and is not available to the public. If you have received
          this message, you are not authorised to access this application. 
        </p>
        <p>Please contact the administrator if you believe this is an error.</p>
      </Card>
    </div>
  );
}

export default page;
