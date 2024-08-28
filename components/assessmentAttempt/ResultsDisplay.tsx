import ResultItemWrapper from "./ResultItemWrapper";
import Link from "next/link";
import { ArrowLeftSquare, RecycleIcon, SkipBack } from "lucide-react";
import { Button } from "../ui/button";
import { SubmittedResponse } from "@/lib/assessmentUtils/getSubmissionResults";
import ReportIssueDialog from "../ReportIssueDialog";
import { Card } from "../ui/card";

interface ResultsDisplayProps {
  submissionId: string;
  assessmentId: string;
  assessmentTitle: string;
  classTitle: string;
  classId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  responses: SubmittedResponse[];
  submitterName: string;
  feedback: string | null;
}

function ResultsDisplay({
  submissionId,
  assessmentId,
  assessmentTitle,
  classTitle,
  classId,
  score,
  totalQuestions,
  correctAnswers,
  responses,
  submitterName,
  feedback,
}: ResultsDisplayProps) {
  return (
    <div className="flex flex-col gap-y-4 w-full py-4">
      <Card className="p-4 flex justify-between">
        <div className="flex flex-col gap-y-2">
          <Link href={`/assessments/${assessmentId}`}>
            <h2 className="text-2xl font-bold">{assessmentTitle}</h2>
            <h2 className="">Assessment Results</h2>
          </Link>
          <p>
            <strong>Submitted by:</strong> {submitterName}
          </p>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="flex h-full gap-x-2">
            <Link
              href={`/assessments/attempt/${assessmentId}`}
              className="w-full flex justify-end"
            >
              <Button className="">Try Again <RecycleIcon className="ml-2"/></Button>
            </Link>
            <Link
              href={`/assessments/${assessmentId}`}
              className="w-full flex justify-end"
            >
              <Button className="">
                Overview <ArrowLeftSquare className="ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-right">
            <strong>Class:</strong> <Link href={`/classes/${classId}`}>{classTitle}</Link>
          </p>
        </div>
      </Card>
      <Card className="p-2">
        <p className="text-xl font-semibold">Score: {score.toFixed(2)}%</p>
        <p>
          Correct Answers: {correctAnswers} out of {totalQuestions}
        </p>
        <div className="flex justify-between items-end mb-2 pb-2 border-b-2">
          <p>
            <strong>Feedback:</strong>
          </p>
          <ReportIssueDialog
            issueType="Feedback"
            issueItemId={submissionId}
            issueObject={feedback!}
          />
        </div>
        <p className="py-1">{feedback ? feedback : "No Feedback Available."}</p>
        {feedback && <p className="text-sm text-center mt-2 py-2 border-t-2">AI Generated Feedback may be inacurate.</p>}
      </Card>
      <div className="space-y-4">
        {responses.map((response, index) => (
          <ResultItemWrapper
            key={response.responseId}
            response={response}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

export default ResultsDisplay;
