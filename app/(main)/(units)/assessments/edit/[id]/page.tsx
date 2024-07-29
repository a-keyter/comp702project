async function EditAssessmentPage({ params }: { params: { id: string } }) {
    return (
    <div>This page is for editing the assessment with id: {params.id}.</div>
  )
}

export default EditAssessmentPage