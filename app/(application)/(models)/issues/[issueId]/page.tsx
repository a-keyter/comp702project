import { fetchIssueById } from "@/lib/issueUtils/fetchIssueById";
import IssueDetailsCard from "@/components/issues/IssueDetailsCard";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/userUtils/getUserDetails";
import IssueChat from "@/components/issues/IssueChat";

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
          issueStatus={issueData.status}
          userName={user.name}
          userRole={user.role}
        />
      )}
    </div>
  );
}
