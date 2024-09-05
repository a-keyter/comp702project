"use client"

// React Imports
import { useEffect, useRef, useState } from "react";

// Type Imports
import { Assessment, Submission } from "@prisma/client";

// Component Imports
import { Skeleton } from "@/components/ui/skeleton";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import { oneClassStudentAssessmentColumns } from "./oneClassAssessmentColumnsStudent";

// Util Import
import { getClassAssessmentsStudent } from "@/lib/assessmentUtils/getAssessmentDetails";




type AssessmentWithAttempts = Assessment & {
  attempts: number;
  submissions: Pick<Submission, "id" | "score" | "createdAt">[];
  class: {
    id: string;
    title: string;
  };
};

export default function LateLoadStudentAssessmentTable({
  classId,
  classTitle,
}: {
  classId: string;
  classTitle: string;
}) {
  const [loading, setLoading] = useState(true);
  const [studentAssessments, setstudentAssessments] = useState<
    AssessmentWithAttempts[]
  >([]);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    async function fetchAssessments() {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      try {
        const assessments = await getClassAssessmentsStudent(classId);
        setstudentAssessments(assessments || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setstudentAssessments([]);
        setLoading(false);
      }
    }
    fetchAssessments();
  }, [classId]);

  if (loading) {
    return <Skeleton className="w-full h-64" />;
  }

  return (
    <AssessmentDataTable
      columns={oneClassStudentAssessmentColumns}
      data={studentAssessments}
      role="STUDENT"
      display="All"
      tableSize="small"
      classId={classId}
      classTitle={classTitle}
      classes={null}
    />
  );
}
