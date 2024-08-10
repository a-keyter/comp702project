"use client";

import { Answer, AssessmentItem } from "@prisma/client";
import { useState } from "react";
import { Button } from "../ui/button";
import AttemptItemWrapper from "./AttemptItemWrapper";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import { initialiseSubmission } from "@/lib/submissionUtils/initialiseSubmission";
import { submitResponses } from "@/lib/submissionUtils/submitResponses";
import { finaliseSubmission } from "@/lib/submissionUtils/finaliseSubmission";

interface AttemptAssessmentProps {
  assessmentId: string;
  classId: string;
  classTitle: string;
  assessmentTitle: string;
  assessmentObjectives: string;
  items: AssessmentItem[];
  mcqAnswers: Record<string, Answer[]>;
}

function AttemptAssessment({
  assessmentId,
  assessmentTitle,
  assessmentObjectives,
  classId,
  classTitle,
  items,
  mcqAnswers,
}: AttemptAssessmentProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleResponseChange = (itemId: string, answerId: string) => {
    setResponses((prev) => ({ ...prev, [itemId]: answerId }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Step 1: Initialise submission
      const initResult = await initialiseSubmission(assessmentId);
      if (!initResult.success || !initResult.submissionId) {
        throw new Error(initResult.error || "Failed to initialize submission");
      }
  
      const submissionId = initResult.submissionId;
  
      // Step 2: Submit all responses at once
      const responsesResult = await submitResponses(submissionId, responses);
      if (!responsesResult.success) {
        throw new Error(responsesResult.error || "Failed to submit responses");
      }
  
      // Ensure all required properties are present
      if (
        typeof responsesResult.totalResponses !== 'number' ||
        typeof responsesResult.correctResponses !== 'number' ||
        !Array.isArray(responsesResult.incorrectResponses)
      ) {
        throw new Error("Invalid response data received");
      }
  
      // Step 3: Finalize submission
      const finalResult = await finaliseSubmission(
        submissionId, 
        assessmentTitle, 
        assessmentObjectives, 
        responsesResult.totalResponses, 
        responsesResult.correctResponses,
        responsesResult.incorrectResponses
      );
      if (!finalResult.success) {
        throw new Error(finalResult.error || "Failed to finalize submission");
      }
  
      setLoading(false);
      router.push(`/assessments/results/${submissionId}`);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting assessment:", error);
      alert("Failed to submit assessment. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-y-2 w-full py-1">
      <div className="flex justify-between items-center py-2">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold">{assessmentTitle}</h2>
          <p>
            Class: {classId.toUpperCase()} - {classTitle}
          </p>
        </div>
      </div>
      <p className="mb-2">
        <strong>Assessment Objectives: </strong>
        {assessmentObjectives}
      </p>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col border-2 py-1 px-2 rounded-md w-full"
        >
          <div className="flex justify-between items-center mb-2">
            {/* <span className="font-bold">Question {index + 1}</span> */}
          </div>
          <AttemptItemWrapper
            item={item}
            answers={item.type === "MCQ" ? mcqAnswers[item.id] : undefined}
            selectedAnswerId={responses[item.id]}
            onSelect={(answerId) => handleResponseChange(item.id, answerId)}
          />
        </div>
      ))}
      <div className="flex justify-end">
      <Button onClick={handleSubmit} className="mt-4">
        Submit Assessment
        {loading && <div className="ml-2"><LoadingSpinner/></div>}
      </Button>
      </div>
    </div>
  );
}

export default AttemptAssessment;