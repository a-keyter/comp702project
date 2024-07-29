import AssessmentEditor from "@/components/assessmentEditor/AssessmentEditor";

async function EditAssessmentPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full max-w-4xl">
      <p>This page is for editing the assessment with id: {params.id}.</p>
    <AssessmentEditor assessmentId={params.id} />
    </div>

  );
}

export default EditAssessmentPage;
