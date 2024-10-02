import AssessmentEditor from "@/components/assessmentEditor/AssessmentEditor";
import NoAccessRedirect from "@/components/redirect/NoAccess";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { loadAssessmentItems } from "@/lib/assessmentUtils/getAssessmentItems";
import { getCurrentUser } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function EditAssessmentPage({ params }: { params: { id: string } }) {
  try {
    // Fetch assessment data
    const assessmentData = await getAssessmentById(params.id);
    if (!assessmentData) {
        return <NoAccessRedirect redirectTo="/dashboard" />;
    }

    // Check if assessment is not in DRAFT status
    if (assessmentData.status !== "DRAFT") {
        return <NoAccessRedirect redirectTo="/dashboard" />;
    }

    // Fetch assessment items
    const assessmentItems = await loadAssessmentItems(params.id);

    // Fetch current user
    const user = await getCurrentUser();
    if (!user) {
      return redirect("/onboard");
    }

    // If user is a student, redirect
    if (user.role === "STUDENT") {
      return <NoAccessRedirect redirectTo="/dashboard" />;
    }

    // Render the page
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
  } catch (error) {
    console.error("Error loading assessment:", error);
    return redirect("/dashboard");
  }
}

export default EditAssessmentPage;
