import AttemptAssessment from "@/components/assessmentAttempt/AttemptAssessment";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { loadAssessmentItems } from "@/lib/assessmentUtils/getAssessmentItems";
import { getCurrentUser } from "@/lib/userUtils/getUserDetails";
import { notFound, redirect } from "next/navigation";

async function AttemptAssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

  if (!assessmentData) {
    notFound();
  }

  if (assessmentData.status === "DRAFT") {
    redirect("/dashboard")
  }


  const assessmentItems = await loadAssessmentItems(params.id);

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/onboard");
  }

  return (
    <div className="w-full max-w-4xl">
      <AttemptAssessment
        assessmentId={params.id}
        classId={assessmentData.classId}
        classTitle={assessmentData.class.title}
        assessmentTitle={assessmentData.title}
        assessmentObjectives={assessmentData.objectives}
        items={assessmentItems.assessmentItems || []}
        mcqAnswers={assessmentItems.mcqAnswers || {}}
      />
      <div
        data-id="attempt-render-complete"
        style={{ display: "none" }}
      ></div>
    </div>
  );
}

export default AttemptAssessmentPage;