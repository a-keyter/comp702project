import AddStudentsDialog from "@/components/AddStudentsDialog";
import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import { oneClassAssessmentColumns } from "@/components/assessmentsTable/oneClassAssessmentColumns";
import { oneClassStudentAssessmentColumns } from "@/components/assessmentsTableStudent/oneClassAssessmentColumnsStudent";
import DeleteClassDialog from "@/components/DeleteClassDialog";
import LateLoadStudentAssessmentStats from "@/app/(main)/(units)/students/[nickname]/LateLoadStudentAssessmentStats";
import { classStudentsColumns } from "@/components/studentsTable/columns";
import { ClassStudentsDataTable } from "@/components/studentsTable/data-table";
import LateLoadStudentsByClassTable from "@/components/studentsTable/LateLoadStudentsByClassTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UpdateClassDialog from "@/components/UpdateClassDialog";
import {
  getClassAssessmentsStudent,
  getClassAssessmentsTeacher,
} from "@/lib/assessmentUtils/getAssessmentDetails";
import { getClassById } from "@/lib/classUtils/getClassDetails";
import { getUserById, getUserDetails } from "@/lib/userUtils/getUserDetails";
import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import SingleClassStudentAssessmentStats from "@/components/assessmentStatistics/SingleClassStudentAssessmentStats";
import CreateAssessmentDialog from "@/components/CreateAssessmentDialog";

async function ClassPage({ params }: { params: { id: string } }) {
  const classData = await getClassById(params.id);

  if (!classData) {
    notFound();
  }

  const user = await getUserDetails();
  const userRole = user?.role;

  if (!user) {
    return redirect("/onboard");
  }

  const teacherAssessments = await getClassAssessmentsTeacher(params.id);
  const studentAssessments = await getClassAssessmentsStudent(params.id);

  let numberOfAssessments;

  if (user.role === "TEACHER") {
    numberOfAssessments = teacherAssessments?.length;
  } else {
    numberOfAssessments = studentAssessments?.length;
  }

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
          <p className="font-bold text-2xl">{numberOfAssessments}</p>
        </Card>
      </div>
      {teacherAssessments && user.role === "TEACHER" && (
        <AssessmentDataTable
          columns={oneClassAssessmentColumns}
          data={teacherAssessments}
          role={user.role}
          tableSize="small"
          display="All"
          classId={classData.id}
          classTitle={classData.title}
          classes={null}
        />
      )}

      {studentAssessments && user.role === "STUDENT" && (
        <AssessmentDataTable
          columns={oneClassStudentAssessmentColumns}
          data={studentAssessments}
          role={user.role}
          display="All"
          tableSize="small"
          classId={null}
          classTitle={null}
          classes={null}
        />
      )}
      {userRole === "STUDENT" && (
        <SingleClassStudentAssessmentStats
          studentNickname={user.nickname}
          classId={params.id}
        />
      )}
      {userRole === "TEACHER" && (
        <Card className="w-full p-2 mt-4">
          <LateLoadStudentsByClassTable
            classId={params.id}
            classTitle={classData.title}
          />
        </Card>
      )}
    </div>
  );
}

export default ClassPage;

//