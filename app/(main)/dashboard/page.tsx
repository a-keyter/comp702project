import { classColumns } from "@/components/classesTable/columns";
import CreateClassDialog from "@/components/CreateClassDialog";
import { ClassDataTable } from "@/components/classesTable/data-table";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import CreateAssessmentDialog from "@/components/CreateAssessmentDialog";

export default async function Dashboard() {
  const user = await getUserDetails();
  if (!user) {
    return redirect("/onboard");
  }

  const classes = await getUserClasses();

  return (
    <div className="w-full max-w-4xl flex flex-col space-y-2">
      {classes && (
        <ClassDataTable
          columns={classColumns}
          data={classes}
          role={user.role}
          tableSize="small"
        ></ClassDataTable>
      )}
      {/* {classes && <AssessmentDataTable columns={classColumns} data={classes} role={user.role} tableSize="small" classCode={null}/>} */}

      <div className="w-full h-60 bg-slate-300 flex justify-between">
        <p>Small Assessments Table </p>
        <CreateAssessmentDialog classCode={null} classTitle={null} classes={classes}/>
      </div>
    </div>
  );
}
