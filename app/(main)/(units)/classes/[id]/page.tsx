import AddStudentsDialog from "@/components/dialogs/AddStudentsDialog";
import DeleteClassDialog from "@/components/dialogs/DeleteClassDialog";
import { Card } from "@/components/ui/card";
import UpdateClassDialog from "@/components/dialogs/UpdateClassDialog";

import { getClassById } from "@/lib/classUtils/getClassDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import Link from "next/link";
import { redirect } from "next/navigation";
import LeaveClassDialog from "./LeaveClassDialog";
import { getAssessmentCount } from "@/lib/assessmentUtils/getAssessmentCount";
import TeacherViewSelect from "./TeacherViewSelect";
import StudentViewSelect from "./StudentViewSelect";

async function ClassPage({ params }: { params: { id: string } }) {
  const classData = await getClassById(params.id);

  if (!classData) {
     redirect("/dashboard");
  }

  const user = await getUserDetails();
  const userRole = user?.role;

  if (!user) {
    return redirect("/onboard");
  }

  const assessmentCount = await getAssessmentCount(params.id);

  return (
    <div className="w-full max-w-4xl mt-2 flex flex-col">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold">
          {classData.id.toUpperCase()} - {classData.title}
        </h2>
        {user.role === "TEACHER" && (
          <div className="flex gap-x-4">
            <UpdateClassDialog classData={classData} />
            <DeleteClassDialog
              classId={classData.id}
              classTitle={classData.title}
            />
          </div>
        )}
        {user.role === "STUDENT" && (
          <div>
            <LeaveClassDialog
              studentNickname={user.nickname}
              classId={params.id}
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 gap-x-2 my-4">
        <Card className="col-span-4 p-2 px-4">
          <h3 className="font-semibold text-lg">Description</h3>
          <p>{classData.description}</p>
          <p className="text-sm pt-2"></p>
        </Card>
        <Card className="col-span-1 p-2">
          {userRole === "TEACHER" ? (
            <div className="flex justify-between">
              <Link href={`/classes/students/${params.id}`}>Students</Link>
              <AddStudentsDialog
                classId={params.id}
                classTitle={classData.title}
                classes={null}
                variant="icon"
              />
            </div>
          ) : (
            <h3>Students</h3>
          )}
          <p className="font-bold text-2xl">{classData.memberCount}</p>
        </Card>
        <Card className="col-span-1 p-2">
          <div className="flex justify-between">
            <h3>Assessments</h3>
          </div>
          <p className="font-bold text-2xl">{assessmentCount}</p>
        </Card>
      </div>

      {classData && user.role === "TEACHER" && (
        <TeacherViewSelect
          classId={classData.id}
          classTitle={classData.title}
          classMemberCount={classData.memberCount}
        />
      )}

      {classData && user.role === "STUDENT" && (
        <StudentViewSelect
          studentNickname={user.nickname}
          classId={classData.id}
          classTitle={classData.title}
        />
      )}
    </div>
  );
}

export default ClassPage;

//
