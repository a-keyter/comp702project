import { assessmentColumns } from "@/components/assessmentsTable/columns";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import { studentAssessmentColumns } from "@/components/assessmentsTableStudent/columns";
import { getStudentAssessmentData, getTeacherAssessmentData } from "@/lib/assessmentUtils/getAssessmentDetails";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function page() {
  const user = await getUserDetails();
  if (!user) {
    return redirect("/onboard");
  }

  const classes = await getUserClasses();

  const teacherAssessments = await getTeacherAssessmentData()
  const studentAssessments = await getStudentAssessmentData()


  return (<div className="w-full h-full max-w-4xl">
  {teacherAssessments && user.role === "TEACHER" && (
    <AssessmentDataTable
      columns={assessmentColumns}
      data={teacherAssessments}
      role={user.role}
      tableSize="large"
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
    tableSize="large"
    classCode={null}
    classTitle={null}
    classes={classes}
    />
  )}

  </div>)
}

export default page;
