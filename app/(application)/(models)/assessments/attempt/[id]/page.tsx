import AttemptAssessment from "@/components/assessmentAttempt/AttemptAssessment";
import NoAccessRedirect from "@/components/redirect/NoAccess";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { loadAssessmentItems } from "@/lib/assessmentUtils/getAssessmentItems";

async function AttemptAssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

  if (!assessmentData) {
    return <NoAccessRedirect redirectTo="/dashboard" />;
  }

  if (assessmentData.status === "DRAFT") {
    return <NoAccessRedirect redirectTo="/dashboard" />;
  }

  const assessmentItems = await loadAssessmentItems(params.id);

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