import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import { oneClassAssessmentColumns } from "@/components/assessmentsTable/oneClassAssessmentColumns";
import { oneClassStudentAssessmentColumns } from "@/components/assessmentsTableStudent/oneClassAssessmentColumnsStudent";
import DeleteClassDialog from "@/components/DeleteClassDialog";
import { classStudentsColumns } from "@/components/studentsTable/columns";
import { ClassStudentsDataTable } from "@/components/studentsTable/data-table";
import LateLoadStudentsByClassTable from "@/components/studentsTable/LateLoadStudentsByClassTable";
import { Card } from "@/components/ui/card";
import UpdateClassDialog from "@/components/UpdateClassDialog";
import {
  getClassAssessmentsStudent,
  getClassAssessmentsTeacher,
} from "@/lib/assessmentUtils/getAssessmentDetails";
import { getClassById } from "@/lib/classUtils/getClassDetails";
import { getUserById, getUserDetails } from "@/lib/userUtils/getUserDetails";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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

  // const creator = await getUserById(classData.);

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold pl-2">
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
          <p className="text-sm pt-2">
            {/* <strong>Created by: </strong> */}
            {/* {creator?.nickname} */}
          </p>
        </Card>
        <Card className="col-span-1 p-2">
          {userRole === "TEACHER" ? (
            <Link href={`/classes/students/${params.id}`}>Students</Link>
          ) : (
            <h3>Students</h3>
          )}
          <p className="font-bold text-2xl">{classData.memberCount}</p>
        </Card>
        <Card className="col-span-1 p-2">
          <h3>Assessments</h3>
          <p className="font-bold text-2xl">{numberOfAssessments}</p>
        </Card>
      </div>
      {teacherAssessments && user.role === "TEACHER" && (
        <AssessmentDataTable
          columns={oneClassAssessmentColumns}
          data={teacherAssessments}
          role={user.role}
          tableSize="small"
          classCode={classData.id}
          classTitle={classData.title}
          classes={null}
        />
      )}

      {studentAssessments && user.role === "STUDENT" && (
        <AssessmentDataTable
          columns={oneClassStudentAssessmentColumns}
          data={studentAssessments}
          role={user.role}
          tableSize="small"
          classCode={null}
          classTitle={null}
          classes={null}
        />
      )}
      <div className="grid grid-cols-6 grid-rows-2 gap-x-2 gap-y-4 mt-4 ">
        {userRole === "STUDENT" && (
          <Card className="col-span-3 row-span-2 p-2">
            Individual Performance Graph
          </Card>
        )}
        <Card className="col-span-3 row-span-2 p-2">
          Class Performance Graph Go Here
        </Card>

        {userRole === "TEACHER" && (
          <Card className="col-span-3 p-2">Lowest Performing Students</Card>
        )}
        {userRole === "TEACHER" && (
          <Card className="col-span-3 p-2">Highest Performing Students</Card>
        )}
      </div>
      {userRole === "TEACHER" && (
        <Card className="w-full p-2 mt-4">
          <LateLoadStudentsByClassTable classId={params.id} />
        </Card>
      )}
    </div>
  );
}

export default ClassPage;
