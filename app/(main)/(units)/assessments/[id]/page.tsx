import { Button } from "@/components/ui/button";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { notFound } from "next/navigation";

async function AssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

  if (!assessmentData) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl py-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold">{assessmentData.title}</h2>
          <p>
            Class: {assessmentData.class.id.toUpperCase()} -{" "}
            {assessmentData.class.title}
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex space-x-4 justify-end">
            <Button>Preview</Button>
            <Button className="bg-yellow-300 text-black hover:text-white">
              Edit
            </Button>
            <Button variant="destructive">Delete</Button>
          </div>
          <p className="text-right">
            <strong>Last Updated:</strong>{" "}
            {new Date(assessmentData.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="my-2 flex flex-col">
        <h2 className="text-xl font-semibold">Assessment Objectives</h2>
        <p>{assessmentData.objectives}</p>
      </div>
      <div className="w-full bg-slate-200 h-60 mb-2">
        Placeholder Responses Table
      </div>
      <div className="w-full bg-slate-200 h-32">Placeholder AI Feedback</div>
    </div>
  );
}

export default AssessmentPage;
