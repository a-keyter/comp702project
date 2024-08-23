import { classColumns } from "@/components/classesTable/columns";
import { getStudentClassesByNickname } from "@/lib/teacherUtils/getStudentClassesByNickname";
import { getUserById, getUserByNickname } from "@/lib/userUtils/getUserDetails";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StudentData from "./StudentData";
import { SingleStudentClassDataTable } from "@/components/classesTable/single-student-data-table";
import LateLoadStudentAssessmentStats from "./LateLoadStudentAssessmentStats";

async function IndividualStudentPage({
  params,
}: {
  params: { nickname: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const user = await getUserById(userId);

  if (!user) {
    return redirect("/onboard");
  }

  if (user.role !== "TEACHER") {
    return redirect(`/classes`);
  }

  const studentData = await getUserByNickname(params.nickname);

  const studentClassData = await getStudentClassesByNickname(
    params.nickname, // student to fetch data
    userId // security check for teacher permission
  );

  const classes = studentClassData.map((c) => {
    return { title: c.title, classId: c.id };
  });

  return (
    <div className="flex flex-col w-full max-w-4xl gap-y-4">
      {studentData && <StudentData student={studentData} />}

      {studentClassData && (
        <SingleStudentClassDataTable
          columns={classColumns}
          data={studentClassData}
          studentName={studentData?.name || ""}
          role={user.role}
          tableSize="small"
        />
      )}
      {studentData && classes && (
        <LateLoadStudentAssessmentStats
          studentName={studentData.name}
          studentNickname={studentData.nickname}
          classes={classes}
        />
      )}
    </div>
  );
}

export default IndividualStudentPage;
