"use server";

import { z } from "zod";
import { model } from "../initModel";

type answerProps = {
    question: string;
    assessmentTitle: string;
}

type mcqAnswers = {
  correctAnswer: string;
  falseAnswer1: string;
  falseAnswer2: string;
  falseAnswer3: string;
  falseAnswer4: string;
};

export async function generateAnswers({
  props
}: {
  props : answerProps;
}): Promise<mcqAnswers> {
  const allAnswers = z.object({
    correctAnswer: z.string().describe("The correct answer to the question."),
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

  const structuredLlm = model.withStructuredOutput(allAnswers, {
    name: "All-MCQ-Answers",
  });

  const response = await structuredLlm.invoke(
    `Generate a Multiple Choice Answers for the following question: ${props.question}. The question is part of an assessment titled ${props.assessmentTitle}.`
)

  return response;
}
