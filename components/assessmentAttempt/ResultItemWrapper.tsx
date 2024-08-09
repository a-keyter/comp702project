import { Response } from "@prisma/client";
import ReportIssueDialog from "../ReportIssueDialog";

export type ResultResponse = {
  id: string;
  assessmentItemId: string;
  question: string;
  givenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

interface ResultItemWrapperProps {
  response: ResultResponse;
  index: number;
}

function ResultItemWrapper({ response, index }: ResultItemWrapperProps) {
  return (
    <div
      className={`p-4 rounded-md ${
        response.isCorrect ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <div className="flex justify-between items-end pb-2 mb-2 border-b-2">
        <h3 className="font-semibold">Question {index}</h3>
        {!response.isCorrect && (
          <ReportIssueDialog issueItemId={response.assessmentItemId} issueType={"Question"} issueObject={response}/>
        )}

      </div>
      <p className="mb-2">{response.question}</p>
      <p className="mb-1">Your answer: {response.givenAnswer}</p>
      {!response.isCorrect && (
        <p className="font-semibold">
          Correct answer: {response.correctAnswer}
        </p>
      )}
    </div>
  );
}

export default ResultItemWrapper;
