import { AssessmentDataTable } from "@/components/assessmentsTable/data-table";
import { oneClassAssessmentColumns } from "@/components/assessmentsTable/oneClassAssessmentColumns";
import CreateAssessmentDialog from "@/components/CreateAssessmentDialog";
import DeleteClassDialog from "@/components/DeleteClassDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UpdateClassDialog from "@/components/UpdateClassDialog";
import { getClassAssessments } from "@/lib/assessmentUtils/getAssessmentDetails";
import { getClassById } from "@/lib/classUtils/getClassDetails";
import { getUserById, getUserDetails } from "@/lib/userUtils/getUserDetails";
import { notFound, redirect } from "next/navigation";

async function ClassPage({ params }: { params: { id: string } }) {
  const classData = await getClassById(params.id);

  if (!classData) {
    notFound();
  }

  const user = await getUserDetails();

  if (!user) {
    return redirect("/onboard");
  }

  const creator = await getUserById(classData.createdById);
  const assessments = await getClassAssessments(params.id);

  return (
    <div className="w-full max-w-4xl mt-2">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold pl-2">
          {classData.id.toUpperCase()} - {classData.title}
        </h2>
        {user.role === "TEACHER" ? (
          <div className="flex gap-x-4">
            <UpdateClassDialog classData={classData} />
            <DeleteClassDialog
              classId={classData.id}
              classTitle={classData.title}
            />
          </div>
        ) : (
          // TODO - Leave Class FUnctionality
          <Button>Leave Class</Button>
        )}
      </div>
      <div className="grid grid-cols-6 gap-x-2 my-4">
        <Card className="col-span-4 p-2 px-4">
          <h3 className="font-semibold text-lg">Description</h3>
          <p>{classData.description}</p>
          <p className="text-sm pt-2">
            <strong>Created by: </strong>
            {creator?.nickname}
          </p>
        </Card>
        <Card className="col-span-1 p-2">
          <h3>Assessments</h3>
          <p className="font-bold text-2xl">XX</p>
        </Card>
        <Card className="col-span-1 p-2">
          <h3>Students</h3>
          <p className="font-bold text-2xl">XX</p>
        </Card>
      </div>
      {assessments && (
        <AssessmentDataTable
          columns={oneClassAssessmentColumns}
          data={assessments}
          role={user.role}
          tableSize="small"
          classCode={classData.id}
          classTitle={classData.title}
          classes={null}
        />
      )}
    </div>
  );
}

export default ClassPage;
