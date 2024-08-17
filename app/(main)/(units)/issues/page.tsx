import LateLoadJoinRequests from "@/components/joinClassTable/LateLoadJoinRequests";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserById } from "@/lib/userUtils/getUserDetails";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function IssuesPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const user = await getUserById(userId);

  if (!user) {
    redirect("/onboard");
  }

  return (
    <div className="flex flex-col gap-y-4 w-full max-w-4xl h-full">
      {user.role === "TEACHER" && (
        <Card className="p-2 w-full flex flex-col gap-y-2">
          <LateLoadJoinRequests />
        </Card>
      )}

      {/* TODO */}

      <Card className="p-2 flex-grow w-full flex flex-col gap-y-2">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Question / Feedback Issues</h2>
          <Link href="/issues/archive">
            <Button>Archive</Button>
          </Link>
        </div>
        <div className="bg-slate-400 rounded-lg flex-1">
          Imagine a table here...
        </div>
      </Card>
    </div>
  );
}
