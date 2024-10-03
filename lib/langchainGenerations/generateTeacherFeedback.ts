import { model } from "../initModel";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

type Question = {
  questionId: string;
  question: string;
  correct_answer: string;
  percent_correct: string;
  incorrect_answers: {
    [key: string]: string;
  };
};

type AssessmentData = {
  assessmentTitle: string | undefined;
  assessmentObjectives: string | undefined;
  averageScore: number;
  lastSubmission: string | undefined;
  submissionsCount: string;
  questions: Question[] | undefined;
};

export async function generateTeacherFeedback(
  data: AssessmentData
): Promise<string | null> {
  try {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are an AI assistant that analyses educational assessments and provides concise, constructive feedback to teachers.",
      ],
      [
        "human",
        `
    Analyse the following assessment data and provide brief, clear feedback to the teacher in less than 200 words:
    
    Assessment: {assessmentTitle}
    Objectives: {assessmentObjectives}
    Average Score: {averageScore}%
    Submissions: {submissionsCount}
    
    Questions and Performance:
    {questionsSummary}
    
    In your response, address:
    1. Overall class performance
    2. Notable patterns, common misconceptions and areas for improvement
    3. Specific teaching or assessment suggestions
    
    Keep your feedback constructive, encouraging, and free of any special formatting.
        `,
      ],
    ]);

    const questionsSummary = data.questions
      ? data.questions
          .map((q) => {
            const incorrectAnswersSummary = Object.entries(q.incorrect_answers)
              .map(([answer, count]) => `${answer}: ${count} times`)
              .join(", ");

            return `
    Question: ${q.question}
    Correct Answer: ${q.correct_answer}
    Percent Correct: ${q.percent_correct}%
    Incorrect Answers: ${incorrectAnswersSummary}
        `.trim();
          })
          .join("\n\n")
      : "No question data available.";

    const outputParser = new StringOutputParser();

    const chain = promptTemplate.pipe(model).pipe(outputParser);

    const response = await chain.invoke({
      assessmentTitle: data.assessmentTitle || "Untitled Assessment",
      assessmentObjectives:
      data.assessmentObjectives || "No objectives provided",
      averageScore: data.averageScore,
      submissionsCount: data.submissionsCount,
      questionsSummary: questionsSummary,
    });

    return response;
  } catch (error) {
    console.error("Error generating feedback:", error);
    return null;
  }
}
