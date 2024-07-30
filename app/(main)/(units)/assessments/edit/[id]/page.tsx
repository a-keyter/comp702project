import AssessmentEditor from "@/components/assessmentEditor/AssessmentEditor";
import { Button } from "@/components/ui/button";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { loadAssessmentItems } from "@/lib/assessmentUtils/getAssessmentItems";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function EditAssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

  if (!assessmentData) {
    notFound();
  }
  const assessmentItems = await loadAssessmentItems(params.id);

  const user = await getUserDetails();

  if (!user) {
    return redirect("/onboard");
  }

  if (user.role === "STUDENT") {
    return redirect(`/assessments/${params.id}`);
  }

  return (
    <div className="w-full max-w-4xl">
      <AssessmentEditor
        assessmentId={params.id}
        classId={assessmentData.classId}
        classTitle={assessmentData.class.title}
        assessmentTitle={assessmentData.title}
        assessmentObjectives={assessmentData.objectives}
        assessmentUpdated={new Date(assessmentData.updatedAt).toLocaleString()}
        initialItems={assessmentItems.assessmentItems}
        initialMcqAnswers={assessmentItems.mcqAnswers}
      />
    </div>
  );
}

export default EditAssessmentPage;
