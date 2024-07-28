import { classColumns } from "@/components/classesTable/columns";
import { ClassDataTable } from "@/components/classesTable/data-table";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function page() {
  const user = await getUserDetails();
  if (!user) {
    return redirect("/onboard");
  }

  const classes = await getUserClasses();

  return (
    <div className="w-full max-w-4xl h-full">
      {classes && (
        <ClassDataTable
          columns={classColumns}
          data={classes}
          role={user.role}
          tableSize="large"
        />
      )}
    </div>
  );
}

export default page;
