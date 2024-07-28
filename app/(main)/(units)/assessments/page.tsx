import { assessmentColumns } from "@/components/assessmentsTable/columns";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import { getUserAssessments } from "@/lib/assessmentUtils/getAssessmentDetails";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function page() {
  const user = await getUserDetails();
  if (!user) {
    return redirect("/onboard");
  }

  const classes = await getUserClasses();
  const assessments = await getUserAssessments();
  

  return (<div className="w-full h-full max-w-4xl">
    {assessments && (
        <AssessmentDataTable
          columns={assessmentColumns}
          data={assessments}
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
