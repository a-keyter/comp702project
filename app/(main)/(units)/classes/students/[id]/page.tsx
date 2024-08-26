import { classStudentsColumns, Student } from "@/components/studentsTable/columns";
import { ClassStudentsDataTable } from "@/components/studentsTable/data-table";
import { Card } from "@/components/ui/card";
import { getClassById } from "@/lib/classUtils/getClassDetails";
import { getStudentsByClassWithStats } from "@/lib/studentUtils/getStudentsByClassWithStats";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function ClassStudentsPage({ params }: { params: { id: string } }) {
  const user = await getUserDetails();

  if (!user) {
    return redirect("/onboard");
  }

  if (user.role !== "TEACHER") {
    return redirect(`/classes/${params.id}`);
  }

  const classData = await getClassById(params.id)

  if (!classData) {
    return redirect("/dashboard")
  }

  const classStudentsData = await getStudentsByClassWithStats(params.id);

  return (
    <div className="w-full max-w-4xl">
      <Card className="w-full p-2">
        <ClassStudentsDataTable classId={params.id} classTitle={classData?.title} tableSize="large" columns={classStudentsColumns} data={classStudentsData}/>
      </Card>
    </div>
  );
}

export default ClassStudentsPage;
