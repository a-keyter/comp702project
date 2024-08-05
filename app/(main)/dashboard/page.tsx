import { classColumns } from "@/components/classesTable/columns";
import CreateClassDialog from "@/components/CreateClassDialog";
import { ClassDataTable } from "@/components/classesTable/data-table";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import CreateAssessmentDialog from "@/components/CreateAssessmentDialog";
import { assessmentColumns } from "@/components/assessmentsTable/columns";
import { getUserAssessments } from "@/lib/assessmentUtils/getAssessmentDetails";

export default async function Dashboard() {
  const user = await getUserDetails();
  if (!user) {
    return redirect("/onboard");
  }

  const classes = await getUserClasses();
  const assessments = await getUserAssessments();
  
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
      {assessments && (
        <AssessmentDataTable
          columns={assessmentColumns}
          data={assessments}
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
