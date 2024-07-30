import DeleteAssessmentDialog from "@/components/DeleteAssessmentDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function AssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

  if (!assessmentData) {
    notFound();
  }

  const user = await getUserDetails();

  if (!user) {
    return redirect("/onboard");
  }

  return (
    <div className="w-full max-w-4xl py-1">
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold">{assessmentData.title}</h2>
          <p>
            Class: {assessmentData.class.id.toUpperCase()} -{" "}
            <Link href={`/classes/${assessmentData.class.id}`}>
            {assessmentData.class.title}
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          {user.role === "TEACHER" && (
            <div className="flex space-x-4 justify-end">
              <Link href={`/assessments/preview/${assessmentData.id}`}>
                <Button>Preview</Button>
              </Link>
              <Link href={`/assessments/edit/${assessmentData.id}`}>
                <Button className="bg-yellow-300 text-black hover:text-white">
                  Edit
                </Button>
              </Link>
              <DeleteAssessmentDialog assessmentId={assessmentData.id} assessmentTitle={assessmentData.title}/>
            </div>
          )}
          {user.role === "STUDENT" && (
            <div className="flex space-x-4 justify-end">
              <Link href={`/assessments/attempt/${assessmentData.id}`}>
                <Button>New Attempt</Button>
              </Link>
              <Link href={`/assessments/edit/${assessmentData.id}`}>
                <Button className="bg-yellow-300 text-black hover:text-white">
                  Edit
                </Button>
              </Link>
              <Button variant="destructive">Delete</Button>
            </div>
          )}
          <p className="text-right">
            <strong>Last Updated:</strong>{" "}
            {new Date(assessmentData.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-x-2 my-2">
        <Card className="col-span-4 p-2 px-2">
          <h3 className="font-semibold text-lg">Assessment Objectives</h3>
          <p>{assessmentData.objectives}</p>
        </Card>
        <Card className="col-span-1 p-2">
          <h3>Submissions</h3>
          <p className="font-bold text-2xl">XX</p>
        </Card>
        <Card className="col-span-1 p-2">
          <h3>Average Score</h3>
          <p className="font-bold text-2xl">XX%</p>
        </Card>
      </div>
      <div className="w-full bg-slate-200 h-60 mb-2">
        Placeholder Responses Table - takes role as an argument
      </div>
      <div className="w-full bg-slate-200 h-32">Placeholder AI Feedback</div>
    </div>
  );
}

export default AssessmentPage;
