"use client";

import { Answer, AssessmentItem } from "@prisma/client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ItemWrapper from "./ItemWrapper";
import { Button } from "../ui/button";
import { saveAssessmentItems } from "@/lib/assessmentUtils/saveAssessmentItems";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import Link from "next/link";
import { Trash } from "lucide-react";

interface AssessmentEditorProps {
  assessmentId: string;
  classId: string;
  classTitle: string;
  assessmentTitle: string;
  assessmentObjectives: string;
  assessmentUpdated: string;
  initialItems?: AssessmentItem[];
  initialMcqAnswers?: Record<string, Answer[]>;
}

function AssessmentEditor({
  assessmentId,
  assessmentTitle,
  classId,
  classTitle,
  assessmentObjectives,
  assessmentUpdated,
  initialItems,
  initialMcqAnswers,
}: AssessmentEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [assessmentItems, setAssessmentItems] = useState<AssessmentItem[]>(
    initialItems || []
  );
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, Answer[]>>(
    initialMcqAnswers || {}
  );

  const createDefaultTextItem = (): AssessmentItem => ({
    id: uuidv4(),
    index: assessmentItems.length,
    content: "",
    type: "CONTEXT",
    assessmentId,
  });

  const createDefaultMcqItem = (): AssessmentItem => ({
    id: uuidv4(),
    index: assessmentItems.length,
    content: "",
    type: "MCQ",
    assessmentId,
  });

  const createDefaultMcqAnswers = (assessmentItemId: string): Answer[] => [
    {
      id: uuidv4(),
      content: "",
      isCorrect: true,
      assessmentItemId,
    },
    {
      id: uuidv4(),
      content: "",
      isCorrect: false,
      assessmentItemId,
    },
    {
      id: uuidv4(),
      content: "",
      isCorrect: false,
      assessmentItemId,
    },
    {
      id: uuidv4(),
      content: "",
      isCorrect: false,
      assessmentItemId,
    },
    {
      id: uuidv4(),
      content: "",
      isCorrect: false,
      assessmentItemId,
    },
  ];

  const addItem = (type: "CONTEXT" | "MCQ") => {
    setAssessmentItems((currentItems) => {
      const newItem =
        type === "CONTEXT" ? createDefaultTextItem() : createDefaultMcqItem();

      if (type === "MCQ") {
        setMcqAnswers((currentAnswers) => ({
          ...currentAnswers,
          [newItem.id]: createDefaultMcqAnswers(newItem.id),
        }));
      }

      return [...currentItems, newItem];
    });
  };

  const updateAssessmentItem = (
    id: string,
    updates: Partial<AssessmentItem>
  ) => {
    setAssessmentItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const updateMcqAnswer = (
    itemId: string,
    answerId: string,
    updates: Partial<Answer>
  ) => {
    setMcqAnswers((currentAnswers) => ({
      ...currentAnswers,
      [itemId]: (currentAnswers[itemId] || []).map((answer) =>
        answer.id === answerId ? { ...answer, ...updates } : answer
      ),
    }));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    setAssessmentItems((currentItems) => {
      const newItems = [...currentItems];
      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= newItems.length) return currentItems;

      [newItems[index], newItems[newIndex]] = [
        newItems[newIndex],
        newItems[index],
      ];

      // Update indices
      return newItems.map((item, idx) => ({
        ...item,
        index: idx,
      }));
    });
  };

  const deleteItem = (index: number) => {
    setAssessmentItems((currentItems) => {
      const newItems = currentItems.filter((_, idx) => idx !== index);
      // Update indices
      return newItems.map((item, idx) => ({
        ...item,
        index: idx,
      }));
    });

    // If the deleted item was an MCQ, remove its answers
    const deletedItem = assessmentItems[index];
    if (deletedItem.type === "MCQ") {
      setMcqAnswers((currentAnswers) => {
        const { [deletedItem.id]: _, ...remainingAnswers } = currentAnswers;
        return remainingAnswers;
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await saveAssessmentItems(assessmentItems, mcqAnswers);
    if (result.success) {
      setLoading(false);
      router.push(`/assessments/${assessmentId}`);
    } else {
      setLoading(false);
      alert("Failed to save assessment items. Please try again.");
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    const result = await saveAssessmentItems(assessmentItems, mcqAnswers);
    if (result.success) {
      setLoading(false);
      router.push(`/assessments/preview/${assessmentId}`);
    } else {
      setLoading(false);
      alert("Failed to save assessment items. Please try again.");
    }
  };

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
            <Button onClick={handlePreview}>Preview</Button>
            <Link href={`/assessments/${assessmentId}`}>
              <Button className="bg-yellow-300 text-black hover:text-white">
                Close Editor
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
      {assessmentItems.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col border-2 py-1 px-2 rounded-md w-full"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Item {index + 1}</span>
            <div className="flex gap-x-2">
              <Button
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
              >
                Up
              </Button>
              <Button
                onClick={() => moveItem(index, "down")}
                disabled={index === assessmentItems.length - 1}
              >
                Down
              </Button>
              <Button
                onClick={() => deleteItem(index)}
                className="bg-red-500 hover:bg-red-700"
              >
                <Trash/>
              </Button>
            </div>
          </div>
          <ItemWrapper
            item={item}
            answers={item.type === "MCQ" ? mcqAnswers[item.id] : undefined}
            onUpdateItem={(updates) => updateAssessmentItem(item.id, updates)}
            onUpdateAnswer={(answerId, updates) =>
              updateMcqAnswer(item.id, answerId, updates)
            }
          />
        </div>
      ))}
      <div className="flex gap-x-2 justify-center">
        <Button onClick={() => addItem("CONTEXT")}>Add Context</Button>
        <Button onClick={() => addItem("MCQ")}>Add MCQ</Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="mt-4">
          Save Assessment
          {loading && (
            <div className="pl-4">
              <LoadingSpinner />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

export default AssessmentEditor;