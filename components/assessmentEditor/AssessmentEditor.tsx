"use client";

import { Answer, AssessmentItem } from "@prisma/client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card } from "../ui/card";
import ItemWrapper from "./ItemWrapper";
import { Button } from "../ui/button";

function AssessmentEditor({ assessmentId }: { assessmentId: string }) {
  const defaultTextItem: AssessmentItem = {
    id: uuidv4(),
    index: 0,
    content: "",
    type: "CONTEXT",
    assessmentId,
  };

  const defaultMCQItem: AssessmentItem = {
    id: uuidv4(),
    index: 0,
    content: "",
    type: "MCQ",
    assessmentId,
  };

  const defaultMcqAnswers = (assessmentItemId: string): Answer[] => [
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

  const [assessmentItems, setAssessmentItems] = useState<AssessmentItem[]>([
    defaultTextItem,
    defaultMCQItem,
  ]);

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, Answer[]>>({
    [defaultMCQItem.id]: defaultMcqAnswers(defaultMCQItem.id),
  });

  const addItem = (type: "CONTEXT" | "MCQ") => {
    setAssessmentItems((currentItems) => {
      const newItem: AssessmentItem = {
        id: uuidv4(),
        index: currentItems.length,
        type,
        content: "",
        assessmentId,
      };

      if (type === "MCQ") {
        setMcqAnswers((currentAnswers) => ({
          ...currentAnswers,
          [newItem.id]: defaultMcqAnswers(newItem.id),
        }));
      }

      return [...currentItems, newItem];
    });
  };

  const updateAssessmentItem = (id: string, updates: Partial<AssessmentItem>) => {
    setAssessmentItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const updateMcqAnswer = (itemId: string, answerId: string, updates: Partial<Answer>) => {
    setMcqAnswers((currentAnswers) => ({
      ...currentAnswers,
      [itemId]: currentAnswers[itemId].map((answer) =>
        answer.id === answerId ? { ...answer, ...updates } : answer
      ),
    }));
  };

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {assessmentItems.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col border-2 py-1 px-2 rounded-md w-full"
        >
          <ItemWrapper
            item={item}
            index={index}
            answers={item.type === "MCQ" ? mcqAnswers[item.id] : undefined}
            onUpdateItem={(updates) => updateAssessmentItem(item.id, updates)}
            onUpdateAnswer={(answerId, updates) => updateMcqAnswer(item.id, answerId, updates)}
          />
        </div>
      ))}
      <div className="flex gap-x-2 justify-center">
      <Button onClick={() => addItem("CONTEXT")}>Add Context</Button>
      <Button onClick={() => addItem("MCQ")}>Add MCQ</Button>
      </div>
    </div>
  );
}

export default AssessmentEditor;