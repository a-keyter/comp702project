"use server";

import { z } from "zod";
import { model } from "../initModel";

type falseAnswerProps = {
    question: string;
    correctAnswer: string;
    assessmentTitle: string;
}

type falseMcqAnswers = {
  falseAnswer1: string;
  falseAnswer2: string;
  falseAnswer3: string;
  falseAnswer4: string;
};

export async function generateFalseAnswers({
  props
}: {
  props : falseAnswerProps;
}): Promise<falseMcqAnswers> {
  const falseAnswers = z.object({
    falseAnswer1: z.string().describe("An incorrect answer to the question."),
    falseAnswer2: z
      .string()
      .describe("A second incorrect answer to the question."),
    falseAnswer3: z
      .string()
      .describe("A third incorrect answer to the question."),
    falseAnswer4: z
      .string()
      .describe("A fourth incorrect answer to the question."),
  });

  const structuredLlm = model.withStructuredOutput(falseAnswers, {
    name: "False-MCQ-Answers",
  });

  const response = await structuredLlm.invoke(
    `Generate False Multiple Choice Answers for the following question: ${props.question}, where the correct answer is ${props.correctAnswer}. The question is part of an assessment titled ${props.assessmentTitle}.`
)

  return response;
}
