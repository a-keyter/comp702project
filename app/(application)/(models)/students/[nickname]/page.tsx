"use server";

import { classColumns } from "@/components/classesTable/columns";
import { getStudentClassesByNickname } from "@/lib/teacherUtils/getStudentClassesByNickname";
import { getUserByNickname } from "@/lib/userUtils/getUserDetails";
import StudentData from "./StudentData";
import { SingleStudentClassDataTable } from "@/components/classesTable/single-student-data-table";
import LateLoadStudentAssessmentStats from "./LateLoadStudentAssessmentStats";
import NoAccessRedirect from "@/components/redirect/NoAccess";

async function IndividualStudentPage({
  params,
}: {
  params: { nickname: string };
}) {
  // Fetch the data
  const studentData = await getUserByNickname(params.nickname);

  // Handle redirect if studentData does not exist
  if (!studentData) {
    return <NoAccessRedirect redirectTo="/dashboard" />;
  }

  const studentClassData = await getStudentClassesByNickname(params.nickname);

  // Handle redirect if studentClassData does not exist
  if (!studentClassData) {
    return <NoAccessRedirect redirectTo="/dashboard" />;
  }

  // Prepare classes data
  const classes = studentClassData.map((c) => ({
    title: c.title,
    classId: c.id,
  }));

  return (
    <div className="flex flex-col w-full max-w-4xl gap-y-4">
      {/* Render student data */}
      <StudentData student={studentData} />

      {/* Render assessment stats */}
      <LateLoadStudentAssessmentStats
        studentName={studentData.name}
        studentNickname={studentData.nickname}
        classes={classes}
      />

      {/* Render class data table */}
      <SingleStudentClassDataTable
        columns={classColumns}
        data={studentClassData}
        studentName={studentData?.name || ""}
        tableSize="small"
      />
    </div>
  );
}

export default IndividualStudentPage;
