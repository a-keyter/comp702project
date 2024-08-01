import { Response } from "@prisma/client";
import ResultItemWrapper from "./ResultItemWrapper";

type ResultResponse = {
    id: string
    question: string
    givenAnswer: string
    correctAnswer: string
    isCorrect: boolean
}

interface ResultsDisplayProps {
  assessmentTitle: string;
  classTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  responses: ResultResponse[];
}

function ResultsDisplay({
  assessmentTitle,
  classTitle,
  score,
  totalQuestions,
  correctAnswers,
  responses,
}: ResultsDisplayProps) {
  return (
    <div className="flex flex-col gap-y-4 w-full py-4">
      <h1 className="text-2xl font-bold">{assessmentTitle} Results</h1>
      <p>Class: {classTitle}</p>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-xl font-semibold">Score: {score.toFixed(2)}%</p>
        <p>
          Correct Answers: {correctAnswers} out of {totalQuestions}
        </p>
      </div>
      <div className="space-y-4">
        {responses.map((response, index) => (
          <ResultItemWrapper key={response.id} response={response} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

export default ResultsDisplay;