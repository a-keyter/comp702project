"use client";

import { useState, useEffect } from "react";
import { questionFeedbackIssueColumns } from "./columns";
import { QuestionFeedbackIssue } from "./columns";
import { QuestionFeedbackIssuesDataTable } from "./data-table";
import { fetchOpenTeacherQuestionFeedbackIssues } from "@/lib/issueUtils/fetchTeacherOpenQFIssues";
import { Skeleton } from "../ui/skeleton";
import { studentQuestionFeedbackIssueColumns } from "./studentColumns";
import { fetchOpenStudentQuestionFeedbackIssues } from "@/lib/issueUtils/fetchStudentOpenQFIssues";

interface LateLoadQuestionFeedbackIssuesProps {
  userRole: string;
  size: "SMALL" | "LARGE"
}

export default function LateLoadQuestionFeedbackIssues({
  userRole,
  size,
}: LateLoadQuestionFeedbackIssuesProps) {
  const [issues, setIssues] = useState<QuestionFeedbackIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedIssues;
        if (userRole === "TEACHER") {
          fetchedIssues = await fetchOpenTeacherQuestionFeedbackIssues();
        } else {
          fetchedIssues = await fetchOpenStudentQuestionFeedbackIssues();
        }

        if (fetchedIssues === null) {
          throw new Error("Failed to fetch issues");
        }

        setIssues(fetchedIssues);
      } catch (err) {
        console.error("Error fetching issues:", err);
        setError(
          "An error occurred while fetching issues. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [userRole]);

  if (loading) {
    return <Skeleton className="flex-1"/>
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <QuestionFeedbackIssuesDataTable
      data={issues}
      columns={userRole === "TEACHER" ? questionFeedbackIssueColumns : studentQuestionFeedbackIssueColumns}
      size={size}
    />
  );
}
