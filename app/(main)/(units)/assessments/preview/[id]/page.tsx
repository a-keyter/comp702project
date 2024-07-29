async function PreviewAssessmentPage({ params }: { params: { id: string } }) {
    return (
    <div>This page is for previewing the assessment with id: {params.id}.</div>
  )
}

export default PreviewAssessmentPage