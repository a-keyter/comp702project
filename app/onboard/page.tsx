import { OnboardForm } from "@/components/OnboardForm";
import { Card } from "@/components/ui/card";
import { getUserById } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

async function OnboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const userDetails = await getUserById(user.id);

  if (userDetails) {
    redirect("/dashboard");
  }

  if (
    !user.emailAddresses[0].emailAddress.includes("@test.com") &&
    !user.emailAddresses[0].emailAddress.includes("e2e.com")
  ) {
    redirect("/unauthorised");
  }

  return (
    <div className="flex flex-col h-screen w-full gap-y-4 items-center justify-center">
      <Card className="flex flex-col gap-y-4 p-8">
        <h2 className="font-semibold text-xl">Welcome to Ambi-Learn!</h2>
        <p>Lets get started by finding out a bit more about you!</p>
        <OnboardForm />
      </Card>
    </div>
  );
}

export default OnboardPage;
