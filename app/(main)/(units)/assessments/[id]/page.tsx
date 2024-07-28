import { getAssessmentById } from '@/lib/assessmentUtils/getAssessmentDetails';
import { notFound } from 'next/navigation';

async function AssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

  if (!assessmentData) {
    notFound();
  }

  return (
    <div className="container w-full max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-4">{assessmentData.title}</h1>
      <div className="bg-white shadow-md rounded pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Assessment Information</h2>
          <p><strong>Objectives:</strong> {assessmentData.objectives}</p>
         </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Class Information</h2>
          <p><strong>Class:</strong> {assessmentData.class.title}</p>
          <p><strong>Class ID:</strong> {assessmentData.class.id}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Creator Information</h2>
          <p><strong>Name:</strong> {assessmentData.createdBy.name}</p>
          <p><strong>Nickname:</strong> {assessmentData.createdBy.nickname}</p>
          <p><strong>Last Updated:</strong> {new Date(assessmentData.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default AssessmentPage;