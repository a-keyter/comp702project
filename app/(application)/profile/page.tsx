import { classColumns } from "@/components/classesTable/columns";
import { ClassDataTable } from "@/components/classesTable/data-table";
import UserDetails from "@/components/profileDialogs/UserDetails";
import { getUserClasses } from "@/lib/classUtils/getClassDetails";
import { getCurrentUser } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/onboard");
  }

  const classes = await getUserClasses();

  return (
    <div className="flex flex-col w-full max-w-4xl gap-y-4">
      <UserDetails user={user} />
      {classes && (
        <ClassDataTable
          columns={classColumns}
          data={classes}
          role={user.role}
          tableSize="small"
        />
      )}
      <div
        data-id="server-render-complete"
        style={{ display: "none" }}
      ></div>
    </div>
  );
}
