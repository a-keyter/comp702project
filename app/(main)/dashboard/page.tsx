import { classColumns } from "@/components/classesTable/columns";
import CreateClassDialog from "@/components/classesTable/CreateClassDialog";
import { ClassDataTable } from "@/components/classesTable/data-table";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUserDetails();
  if (!user) {
    return redirect('/onboard');
  }

  const classes = await getUserClasses()



  return (
    <div className="w-full max-w-4xl flex flex-col space-y-2">
        {classes && <ClassDataTable columns={classColumns} data={classes} role ={user.role} tableSize="small"></ClassDataTable>}
        {classes && <ClassDataTable columns={classColumns} data={classes} role ={user.role} tableSize="small"></ClassDataTable>}

      {/* <div className="w-full h-60 bg-slate-300">Small Assessments Table </div> */}
    </div>
  );
}
