"use client";

import { Answer, AssessmentItem } from "@prisma/client";
import { useState } from "react";
import { Button } from "../ui/button";
import AttemptItemWrapper from "./AttemptItemWrapper";
import { useRouter } from "next/navigation";
import { submitResponses } from "@/lib/assessmentUtils/submitResponses";
import LoadingSpinner from "../LoadingSpinner";

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
  classId,
  classTitle,
  assessmentObjectives,
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
    setLoading(true)
    try {
      const result = await submitResponses({
        assessmentId,
        responses,
      });
  
      if (result.success) {
        setLoading(false)
        router.push(`/assessments/results/${result.submissionId}`);
      } else {
        throw new Error(result.error);
      }
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