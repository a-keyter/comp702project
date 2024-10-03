"use client";

import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createTeacherFeedback } from "@/lib/analysisUtils/createTeacherFeedback";
import { getTeacherFeedback } from "@/lib/analysisUtils/getTeacherFeedback";

export interface TeacherFeedbackDetails {
  content: string;
  lastSubmissionId: string;
}

interface TeacherFeedbackProps {
  assessmentId: string;
  averageScore: number;
  submissionCount: number;
  membersCount: number;
  latestSubmissionId: string;
}

export default function TeacherFeedback({
  assessmentId,
  averageScore,
  submissionCount,
  membersCount,
  latestSubmissionId,
}: TeacherFeedbackProps) {
  const [loading, setLoading] = useState(true);
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const isMounted = useRef(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (isMounted.current) return;
      isMounted.current = true;

      try {
        setLoading(true);

        // First check if there is any feedback
        const teacherFeedback = await getTeacherFeedback(assessmentId);

        if (
          teacherFeedback &&
          teacherFeedback.lastSubmissionId === latestSubmissionId
        ) {
          setFeedbackContent(teacherFeedback.content);
        } else {
          const newFeedback = await createTeacherFeedback({
            assessmentId,
            averageScore,
            submissionCount,
            membersCount,
          });
          setFeedbackContent(newFeedback);
        }
      } catch (error) {
        console.error("Error generating new feedback:", error);
        setFeedbackContent(
          "Failed to generate new feedback. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [
    latestSubmissionId,
    assessmentId,
    averageScore,
    submissionCount,
    membersCount,
  ]);
  if (loading) {
    return (
      <div className="w-full flex flex-col space-y-3">
        <h2 className="font-semibold text-xl">AI Generated Feedback</h2>
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <h2 className="font-semibold text-xl">AI Generated Feedback</h2>
      <p>{feedbackContent}</p>
      <hr />
      <p className="text-center text-sm">AI generated feedback may not be 100% accurate.</p>
    </div>
  );
}
