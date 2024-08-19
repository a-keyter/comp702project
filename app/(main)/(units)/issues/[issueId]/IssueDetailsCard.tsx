import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { rejectJoinRequest } from "@/lib/issueUtils/rejectJoinRequest";
import { addUserToClass } from "@/lib/issueUtils/addUserToClass";
import { toast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";
import { Ban, Plus } from "lucide-react";
import JoinRequestActions from "./JoinRequestActions";

type IssueDetailsCardProps = {
  issue: {
    id: string;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    raisedBy: {
      id: string;
      name: string;
      email: string;
    };
    lastUpdatedBy: {
      id: string;
      name: string;
    };
    relevantClass: {
      id: string;
      title: string;
    };
    relevantAssessment?: {
      id: string;
      title: string;
    } | null;
    question?: string | null;
    givenAnswer?: string | null;
    correctAnswer?: string | null;
    feedback?: string | null;
  };
};

export default function IssueDetailsCard({ issue }: IssueDetailsCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  let issueType;

  if (issue.type === "FEEDBACK_ISSUE") {
    issueType = "Feedback Issue";
  } else if (issue.type === "QUESTION_ISSUE") {
    issueType = "Question Issue";
  } else if (issue.type === "CLASS_JOIN_REQUEST") {
    issueType = "Class Join Request";
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{issueType}</CardTitle>
          <Badge className="text-center">{issue.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-1">
            <h3 className="font-semibold">Raised By</h3>
            <p>{issue.raisedBy.name}</p>
          </Card>
          {/*  */}
          <Card className="p-1">
            <h3 className="font-semibold">Last Updated By</h3>
            <p>{issue.lastUpdatedBy.name}</p>
          </Card>
          <Card className="p-1">
            <h3 className="font-semibold">Relevant Class</h3>
            <p>{issue.relevantClass.title}</p>
          </Card>
          <Card className="p-1">
            <h3 className="font-semibold">Created At</h3>
            <p>{formatDate(issue.createdAt)}</p>
          </Card>

          <Card className="p-1">
            <h3 className="font-semibold">Updated At</h3>
            <p>{formatDate(issue.updatedAt)}</p>
          </Card>

          {issue.type === "CLASS_JOIN_REQUEST" && (
            <Card className="p-1">
              <h3 className="font-semibold">Accept / Reject</h3>
              <JoinRequestActions
                issueId={issue.id}
                userEmail={issue.raisedBy.email}
                userName={issue.raisedBy.name}
                classId={issue.relevantClass.id}
                className={issue.relevantClass.title}
              />
            </Card>
          )}

          {issue.relevantAssessment && (
            <Card className="p-1">
              <h3 className="font-semibold">Relevant Assessment</h3>
              <p>{issue.relevantAssessment.title}</p>
            </Card>
          )}
        </div>
        {issue.question && (
          <div className="mt-4">
            <h3 className="font-semibold">Question</h3>
            <p>{issue.question}</p>
          </div>
        )}
        {issue.feedback && (
          <div className="mt-4">
            <h3 className="font-semibold">Feedback</h3>
            <p>{issue.feedback}</p>
          </div>
        )}
        {issue.correctAnswer && issue.givenAnswer && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card className="p-1 bg-red-200">
              <h3 className="font-semibold">Given Answer</h3>
              <p>{issue.givenAnswer}</p>
            </Card>
            <Card className="p-1 bg-green-200">
              <h3 className="font-semibold">Correct Answer</h3>
              <p>{issue.correctAnswer}</p>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
