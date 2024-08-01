import { Response } from "@prisma/client";

export type ResultResponse = {
    id: string
    question: string
    givenAnswer: string
    correctAnswer: string
    isCorrect: boolean
}

interface ResultItemWrapperProps {
  response: ResultResponse;
  index: number;
}

function ResultItemWrapper({ response, index }: ResultItemWrapperProps) {
  return (
    <div className={`p-4 rounded-md ${response.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
      <h3 className="font-semibold mb-2">Question {index}</h3>
      <p className="mb-2">{response.question}</p>
      <p className="mb-1">Your answer: {response.givenAnswer}</p>
      {!response.isCorrect && (
        <p className="font-semibold">Correct answer: {response.correctAnswer}</p>
      )}
    </div>
  );
}

export default ResultItemWrapper;