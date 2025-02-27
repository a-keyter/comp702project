// Component Imports
import { Card } from "@/components/ui/card";
import { assessmentColumns } from "@/components/assessmentsTable/columns";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";

// Util Imports
import {
  getStudentAssessmentData,
  getTeacherAssessmentData,
} from "@/lib/assessmentUtils/getAssessmentDetails";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getCurrentUser } from "@/lib/userUtils/getUserDetails";

// NextJS Import
import { redirect } from "next/navigation";
import { studentAssessmentColumns } from "@/components/assessmentsTable/studentAssessmentColumns";

async function page() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/onboard");
  }

  const classes = await getUserClasses();

  if (!classes){
    redirect("/dashboard")
  }

  const teacherAssessments = await getTeacherAssessmentData();
  const studentAssessments = await getStudentAssessmentData();

  return (
    <div className="w-full h-full max-w-4xl">
      {teacherAssessments && user.role === "TEACHER" && (
        <Card className="p-2 h-full">
          <AssessmentDataTable
            columns={assessmentColumns}
            data={teacherAssessments}
            role={user.role}
            display="All"
            tableSize="large"
            classId={null}
            classTitle={null}
            classes={classes}
          />
        </Card>
      )}

      {studentAssessments && user.role === "STUDENT" && (
        <Card className="p-2 h-full">
          <AssessmentDataTable
            columns={studentAssessmentColumns}
            data={studentAssessments}
            role={user.role}
            display="All"
            tableSize="large"
            classId={null}
            classTitle={null}
            classes={classes}
          />
        </Card>
      )}
    </div>
  );
}

export default page;
