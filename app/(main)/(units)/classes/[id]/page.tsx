import CreateAssessmentDialog from '@/components/CreateAssessmentDialog';
import { Button } from '@/components/ui/button';
import UpdateClassDialog from '@/components/UpdateClassDialog';
import { getClassById } from '@/lib/classUtils/getClassDetails';
import { getUserById } from '@/lib/userUtils/getUserDetails';
import { notFound } from 'next/navigation';

async function ClassPage({ params }: { params: { id: string } }) {
  const classData = await getClassById(params.id);

  if (!classData) {
    notFound();
  }

  const creator = await getUserById(classData.createdById);

  return (
    <div className="container w-full max-w-4xl p-4">
      <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold mb-4">{classData.id.toUpperCase()} - {classData.title}</h2>
      <div className='flex gap-x-4'>
        <UpdateClassDialog classData={classData} />
        <Button variant="destructive">Delete Class</Button>
      </div>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Class Information</h2>
          <p><strong>ID:</strong> {classData.id.toUpperCase()}</p>
          <p><strong>Description:</strong> {classData.description}</p>
          <p><strong>Created At:</strong> {classData.createdAt.toLocaleString()}</p>
          <p><strong>Updated At:</strong> {classData.updatedAt.toLocaleString()}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Creator Information</h2>
          {creator ? (
            <>
              <p><strong>Name:</strong> {creator.name}</p>
              <p><strong>Nickname:</strong> {creator.nickname}</p>
            </>
          ) : (
            <p>Creator information not available</p>
          )}
        </div>

      </div>
      <CreateAssessmentDialog classCode={classData.id} classTitle={classData.title} classes={null}/>

    </div>
  );
}

export default ClassPage;