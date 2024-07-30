import { Answer, AssessmentItem } from "@prisma/client";
import { Button } from "../ui/button";
import Link from "next/link";
import PreviewItemWrapper from "./PreviewItemWrapper";

interface PreviewDisplayProps {
  assessmentId: string;
  classId: string;
  classTitle: string;
  assessmentTitle: string;
  assessmentObjectives: string;
  assessmentUpdated: string;
  items: AssessmentItem[];
  mcqAnswers: Record<string, Answer[]>;
}

function PreviewDisplay({
  assessmentId,
  assessmentTitle,
  classId,
  classTitle,
  assessmentObjectives,
  assessmentUpdated,
  items,
  mcqAnswers,
}: PreviewDisplayProps) {
  return (
    <div className="flex flex-col gap-y-2 w-full py-1">
      <div className="flex justify-between items-center py-2">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold">{assessmentTitle}</h2>
          <p>
            Class: {classId.toUpperCase()} - {classTitle}
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex space-x-4 justify-end">
            <Link href={`/assessments/edit/${assessmentId}`}>
              <Button>Edit Assessment</Button>
            </Link>
            <Link href={`/assessments/${assessmentId}`}>
              <Button className="bg-yellow-300 text-black hover:text-white">
                Close Preview
              </Button>
            </Link>
          </div>
          <p className="text-right">
            <strong>Last Updated:</strong> {assessmentUpdated}
          </p>
        </div>
      </div>
      <p className="mb-2">
        <strong>Assessment Objectives: </strong>
        {assessmentObjectives}
      </p>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col border-2 py-1 px-2 rounded-md w-full"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{index + 1}</span>
          </div>
          <PreviewItemWrapper
            item={item}
            answers={item.type === "MCQ" ? mcqAnswers[item.id] : undefined}
          />
        </div>
      ))}
    </div>
  );
}

export default PreviewDisplay;