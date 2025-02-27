import LateLoadQuestionFeedbackIssues from "@/components/issuesTable/LateLoadIssuesTable";
import LateLoadJoinRequests from "@/components/joinClassTable/LateLoadJoinRequests";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

export default async function IssuesPage() {
  const user = await getCurrentUser();

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

      <Card className="p-2 flex-grow w-full flex flex-col gap-y-2">
        <LateLoadQuestionFeedbackIssues userRole={user.role} size={user.role === "TEACHER" ? "SMALL" : "LARGE"}/>
      </Card>
    </div>
  );
}
