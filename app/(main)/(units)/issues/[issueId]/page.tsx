import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchIssueById } from "@/lib/issueUtils/fetchIssueById";
import { Send } from "lucide-react";
import IssueDetailsCard from "./IssueDetailsCard";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/userUtils/getUserDetails";
import { Skeleton } from "@/components/ui/skeleton";
import IssueChat from "./IssueChat";

export default async function IssuePage({
  params,
}: {
  params: { issueId: string };
}) {
  const { userId } = auth();

  let user;
  if (userId) {
    user = await getUserById(userId);
  }

  if (!user) {
    redirect("/onboard");
  }

  const issueData = await fetchIssueById(params.issueId);

  if (!issueData) {
    redirect("/issues");
  }

  return (
    <div className="flex flex-col w-full max-w-4xl flex-1 gap-y-4">
      {/* This component will display the data about the issue. */}
      <IssueDetailsCard issue={issueData} />

      {issueData.type !== "CLASS_JOIN_REQUEST" && (
        <IssueChat
          issueId={params.issueId}
          userName={user.name}
          userRole={user.role}
        />
      )}
    </div>
  );
}
