import { classStudentsColumns, Student } from "@/components/studentsTable/columns";
import { ClassStudentsDataTable } from "@/components/studentsTable/data-table";
import { Card } from "@/components/ui/card";
import { getStudentsByClassWithStats } from "@/lib/studentUtils/getStudentsByClassWithStats";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";


async function ClassStudentsPage({ params }: { params: { id: string } }) {
  const user = await getUserDetails();

  const classStudentsData = await getStudentsByClassWithStats(params.id);

  if (!user) {
    return redirect("/onboard");
  }

  if (user.role !== "TEACHER") {
    return redirect(`/classes/${params.id}`);
  }

  return (
    <div className="w-full max-w-4xl">
      <Card className="w-full p-2">
        <ClassStudentsDataTable classCode={params.id} tableSize="large" columns={classStudentsColumns} data={classStudentsData}/>
      </Card>
    </div>
  );
}

export default ClassStudentsPage;
