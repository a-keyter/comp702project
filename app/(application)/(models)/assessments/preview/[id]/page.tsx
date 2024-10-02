import PreviewDisplay from "@/components/assessmentPreview/PreviewDisplay";
import NoAccessRedirect from "@/components/redirect/NoAccess";

import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { loadAssessmentItems } from "@/lib/assessmentUtils/getAssessmentItems";
import { getCurrentUser } from "@/lib/userUtils/getUserDetails";

import { redirect } from "next/navigation";

async function PreviewAssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

  if (!assessmentData) {
    return <NoAccessRedirect redirectTo="/dashboard" />;
  }
  
  const assessmentItems = await loadAssessmentItems(params.id);

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/onboard");
  }

  if (user.role === "STUDENT") {
    return <NoAccessRedirect redirectTo={`/dashboard`} />;
  }

  return (
    <div className="w-full max-w-4xl">
      <PreviewDisplay
        assessmentId={params.id}
        classId={assessmentData.classId}
        classTitle={assessmentData.class.title}
        assessmentTitle={assessmentData.title}
        assessmentObjectives={assessmentData.objectives}
        assessmentUpdated={new Date(assessmentData.updatedAt).toLocaleString()}
        items={assessmentItems.assessmentItems || []}
        mcqAnswers={assessmentItems.mcqAnswers || {}}
      />
    </div>
  );
}

export default PreviewAssessmentPage;