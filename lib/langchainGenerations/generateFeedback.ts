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

export async function generateFeedback({
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

      ${incorrectResponses.map((response) => 
        `Q: ${response.question.slice(0, 50)}... 
         Given: ${response.givenAnswer.slice(0, 20)}... 
         Correct: ${response.correctAnswer.slice(0, 20)}...`
      ).join('\n')}

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