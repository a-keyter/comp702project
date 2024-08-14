"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createTeacherFeedback } from "@/lib/analysisUtils/generateTeacherFeedback";

export interface TeacherFeedbackDetails {
  content: string;
  lastSubmissionId: string;
}

interface TeacherFeedbackProps {
  teacherFeedback: TeacherFeedbackDetails | null;
  assessmentId: string;
  averageScore: number;
  submissionCount: number;
  membersCount: number;
  latestSubmissionId: string;
}

export default function TeacherFeedback({
  teacherFeedback,
  assessmentId,
  averageScore,
  submissionCount,
  membersCount,
  latestSubmissionId,
}: TeacherFeedbackProps) {
  const [loading, setLoading] = useState(true);
  const [feedbackContent, setFeedbackContent] = useState<string>("");

  const checkAndUpdateFeedback = useCallback(async () => {
    async function checkAndUpdateFeedback() {
      if (
        teacherFeedback &&
        teacherFeedback.lastSubmissionId === latestSubmissionId
      ) {
        setFeedbackContent(teacherFeedback.content);
      } else {
        try {
          setLoading(true);
          const newFeedback = await createTeacherFeedback({
            assessmentId,
            averageScore,
            submissionCount,
            membersCount,
          });
          setFeedbackContent(newFeedback);
        } catch (error) {
          console.error("Error generating new feedback:", error);
          setFeedbackContent(
            "Failed to generate new feedback. Please try again later."
          );
        }
      }
      setLoading(false);
    }

    checkAndUpdateFeedback();
  }, [
    teacherFeedback,
    latestSubmissionId,
    assessmentId,
    averageScore,
    submissionCount,
    membersCount,
  ]);

  useEffect(() => {
    checkAndUpdateFeedback();
  }, [checkAndUpdateFeedback]);

  if (loading) {
    return (
      <div className="w-full flex flex-col space-y-2">
        <h2 className="font-semibold text-xl">AI Generated Feedback</h2>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="font-semibold text-xl">AI Generated Feedback</h2>
      <p>{feedbackContent}</p>
    </div>
  );
}
