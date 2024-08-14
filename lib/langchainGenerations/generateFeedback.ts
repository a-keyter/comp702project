import { model } from "../initModel";

interface IncorrectResponse {
  question: string;
  givenAnswer: string;
  correctAnswer: string;
}

interface FeedbackProps {
  assessmentTitle: string;
  assessmentObjectives: string;
  incorrectResponses: IncorrectResponse[];
}

export async function generateStudentFeedback({
  assessmentTitle,
  assessmentObjectives,
  incorrectResponses,
}: FeedbackProps): Promise<string> {
  if (incorrectResponses.length !== 0) {
    const detailedFeedbackPrompt = `
      As an educational assistant, provide concise and actionable feedback for an assessment.
      Assessment: "${assessmentTitle}"
      Objectives: "${assessmentObjectives}"
      Incorrect Responses: ${incorrectResponses.length}

      ${incorrectResponses
        .map(
          (response) =>
            `Q: ${response.question} 
         Given: ${response.givenAnswer} 
         Correct: ${response.correctAnswer}`
        )
        .join("\n")}

      Provide feedback in this format:
      1. One sentence of encouragement.
      2. List 2-3 key topics to review, without mentioning specific questions.
      3. One specific, actionable tip for improvement.

      Keep the total feedback under 100 words. Use plain text without markdown formatting.
    `;

    const response = await model.invoke(detailedFeedbackPrompt);
    return response.content.toString();
  } else {
    const positiveFeedbackPrompt = `
      As an educational assistant, provide concise and motivating feedback for a perfect score on an assessment.
      Assessment: "${assessmentTitle}"
      Objectives: "${assessmentObjectives}"

      Provide feedback in this format:
      1. One sentence congratulating the student.
      2. Mention one key strength demonstrated, based on the assessment objectives.
      3. Suggest one specific advanced topic or resource for further learning.

      Keep the total feedback under 50 words. Use plain text without markdown formatting.
    `;

    const response = await model.invoke(positiveFeedbackPrompt);
    return response.content.toString();
  }
}

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
        "You are an AI assistant that analyzes educational assessments and provides concise, constructive feedback to teachers.",
      ],
      [
        "human",
        `
    Analyze the following assessment data and provide brief, clear feedback to the teacher:
    
    Assessment: {assessmentTitle}
    Objectives: {assessmentObjectives}
    Average Score: {averageScore}%
    Submissions: {submissionsCount}
    
    Questions and Performance:
    {questionsSummary}
    
    In your response, address:
    1. Overall class performance
    2. Strengths and areas for improvement
    3. Specific teaching or assessment suggestions
    4. Notable patterns or common misconceptions
    
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
