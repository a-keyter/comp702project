"use server";

import { z } from "zod";
import { model } from "../initModel";

type McqProps = {
  assessmentTitle: string;
  assessmentObjectives: string;
  existingQuestions: string[];
};

type McqResult = {
  question: string;
  correctAnswer: string;
  falseAnswer1: string;
  falseAnswer2: string;
  falseAnswer3: string;
  falseAnswer4: string;
};

export async function generateFullMcq({
  assessmentDetails,
}: {
  assessmentDetails: McqProps;
}): Promise<McqResult> {
  const fullMcq = z.object({
    question: z
      .string()
      .describe(
        assessmentDetails.existingQuestions.length === 0
          ? "The assessment question."
          : `The assessment question, Must be different from ${assessmentDetails.existingQuestions}`
      ),
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

  const structuredLlm = model.withStructuredOutput(fullMcq, {
    name: "Multiple-Choice-Question",
  });


  const response = await structuredLlm.invoke(
    `Generate a Multiple Choice Question for an assessment titled ${assessmentDetails.assessmentTitle}. The objectives of the asssessment are: ${assessmentDetails.assessmentObjectives}. The question must be semantically different from ${assessmentDetails.existingQuestions}`
  );

  return response;
}
