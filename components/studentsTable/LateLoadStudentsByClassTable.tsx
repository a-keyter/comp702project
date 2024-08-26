"use client";
import React, { useState, useEffect, useRef } from "react";
import { getStudentsByClassWithStats } from "@/lib/studentUtils/getStudentsByClassWithStats";
import { ClassStudentsDataTable } from "./data-table";
import { classStudentsColumns } from "./columns";
import { Skeleton } from "../ui/skeleton";

type Student = {
  name: string;
  nickname: string;
  classId: string;
  assessmentsCompleted: string;
  averageGrade: number;
};

export default function LateLoadStudentsByClassTable({
  classId,
  classTitle,
}: {
  classId: string;
  classTitle: string;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const fetchStudents = async () => {
      try {
        const data = await getStudentsByClassWithStats(classId);
        if (!data) {
          throw new Error("Failed to fetch data");
        }
        setStudents(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  if (loading) {
    return <Skeleton className="w-full h-64" />;
  }

  return (
    <ClassStudentsDataTable
      classId={classId}
      classTitle={classTitle}
      tableSize="small"
      columns={classStudentsColumns}
      data={students}
    />
  );
}
