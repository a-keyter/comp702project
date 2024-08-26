"use client";

import React, { useState, useEffect, useRef } from "react";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import { oneClassAssessmentColumns } from "@/components/assessmentsTable/oneClassAssessmentColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { getClassAssessmentsTeacher } from "@/lib/assessmentUtils/getAssessmentDetails";
import { $Enums } from "@prisma/client";

export type AssessmentWithStats = {
  id: string;
  title: string;
  objectives: string;
  status: $Enums.AssessmentStatus;
  classId: string;
  createdById: string;
  submissionCount: number;
  averageScore: string;
  submissions: undefined;
  class: {
    id: string;
    title: string;
  };
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
};

export default function LateLoadTeacherAssessmentTable({
  classId,
  classTitle,
}: {
  classId: string;
  classTitle: string;
}) {
  const [loading, setLoading] = useState(true);
  const [teacherAssessments, setTeacherAssessments] = useState<
    AssessmentWithStats[]
  >([]);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    async function fetchAssessments() {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      try {
        const assessments = await getClassAssessmentsTeacher(classId);
        setTeacherAssessments(assessments || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setTeacherAssessments([]);
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
      columns={oneClassAssessmentColumns}
      data={teacherAssessments}
      role="TEACHER"
      tableSize="small"
      display="All"
      classId={classId}
      classTitle={classTitle}
      classes={null}
    />
  );
}
