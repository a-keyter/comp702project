import { classColumns } from "@/components/classesTable/columns";
import CreateClassDialog from "@/components/CreateClassDialog";
import { ClassDataTable } from "@/components/classesTable/data-table";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import CreateAssessmentDialog from "@/components/CreateAssessmentDialog";
import { assessmentColumns } from "@/components/assessmentsTable/columns";
import { getStudentAssessmentData, getTeacherAssessmentData } from "@/lib/assessmentUtils/getAssessmentDetails";
import { studentAssessmentColumns } from "@/components/assessmentsTableStudent/columns";

export default async function Dashboard() {
  const user = await getUserDetails();
  if (!user) {
    return redirect("/onboard");
  }

  const classes = await getUserClasses();
  const teacherAssessments = await getTeacherAssessmentData()
  const studentAssessments = await getStudentAssessmentData()

  return (
    <div className="w-full max-w-4xl flex flex-col flex-grow space-y-4">
      {classes && (
        <ClassDataTable
          columns={classColumns}
          data={classes}
          role={user.role}
          tableSize="small"
        />
      )}
      {teacherAssessments && user.role === "TEACHER" && (
        <AssessmentDataTable
          columns={assessmentColumns}
          data={teacherAssessments}
          role={user.role}
          tableSize="small"
          classCode={null}
          classTitle={null}
          classes={classes}
        />
      )}

      {studentAssessments && user.role === "STUDENT" && (
        <AssessmentDataTable
        columns={studentAssessmentColumns}
        data={studentAssessments}
        role={user.role}
        tableSize="small"
        classCode={null}
        classTitle={null}
        classes={classes}
        />
      )}

    </div>
  );
}
