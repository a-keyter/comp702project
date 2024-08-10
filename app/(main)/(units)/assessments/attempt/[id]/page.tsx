import AttemptAssessment from "@/components/assessmentAttempt/AttemptAssessment";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { loadAssessmentItems } from "@/lib/assessmentUtils/getAssessmentItems";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { notFound, redirect } from "next/navigation";

async function AttemptAssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

  if (!assessmentData) {
    notFound();
  }
  const assessmentItems = await loadAssessmentItems(params.id);

  const user = await getUserDetails();

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
    </div>
  );
}

export default AttemptAssessmentPage;