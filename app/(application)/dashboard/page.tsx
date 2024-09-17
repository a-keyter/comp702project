import { classColumns } from "@/components/classesTable/columns";
import { ClassDataTable } from "@/components/classesTable/data-table";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import { assessmentColumns } from "@/components/assessmentsTable/columns";
import {
  getUpcomingStudentAssessmentData,
  getUpcomingTeacherAssessmentData,
} from "@/lib/assessmentUtils/getAssessmentDetails";

import { Card } from "@/components/ui/card";
import RedirectToOnboarding from "./RedirectToOnboarding";
import { studentAssessmentColumns } from "@/components/assessmentsTable/studentAssessmentColumns";

export default async function Dashboard() {
  const user = await getUserDetails();
  if (!user) {
    return <RedirectToOnboarding/>
  } 

  const classes = await getUserClasses();
  const teacherAssessments = await getUpcomingTeacherAssessmentData();
  const studentAssessments = await getUpcomingStudentAssessmentData();

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
        <Card className="p-2 h-full">
          <AssessmentDataTable
            columns={assessmentColumns}
            data={teacherAssessments}
            role={user.role}
            tableSize="small"
            display="Upcoming"
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
            tableSize="small"
            display="Upcoming"
            classId={null}
            classTitle={null}
            classes={classes}
          />
        </Card>
      )}
      <div
        data-id="server-render-complete"
        style={{ display: "none" }}
      ></div>
    </div>
  );
}
