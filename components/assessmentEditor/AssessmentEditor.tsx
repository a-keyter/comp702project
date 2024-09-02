"use client";

// React / Next Imports
import { useEffect, useState } from "react";

// Component Imports
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Trash } from "lucide-react";

import ItemWrapper from "./ItemWrapper";
import LoadingSpinner from "../LoadingSpinner";
import AIWarningDialog from "./AiWarningDialog";
import NewAssessmentDialog from "./NewAssessmentDialog";

// Type Imports
import { Answer, AssessmentItem } from "@prisma/client";

// Function Imports
import { v4 as uuidv4 } from "uuid";

import { saveAssessmentItems } from "@/lib/assessmentUtils/saveAssessmentItems";
import { useRouter } from "next/navigation";
import { generateFullMcq } from "@/lib/langchainGenerations/generateMCQ";
import { generateAnswers } from "@/lib/langchainGenerations/generateAnswers";
import { generateFalseAnswers } from "@/lib/langchainGenerations/generateFalseAnswers";
import { setAssessmentLive } from "@/lib/assessmentUtils/setAssessmentLive";

// Define the arguments that will be passed to the component
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

// React Functional Component
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
  const [publishLoading, setPublishLoading] = useState<boolean>(false);
  const [assessmentItems, setAssessmentItems] = useState<AssessmentItem[]>(
    initialItems || []
  );
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, Answer[]>>(
    initialMcqAnswers || {}
  );
  const [showAiWarning, setShowAiWarning] = useState<boolean>(false);
  const [hasUsedAiGeneration, setHasUsedAiGeneration] = useState<boolean>(true);
  const [newAssessmentOptionsDialog, showNewAssessmentOptionsDialog] =
    useState<boolean>(false);
  useEffect(() => {
    if (initialItems?.length === 0) {
      showNewAssessmentOptionsDialog(true);
    }
  }, [initialItems]);

  // Default Data Structures 
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

  // Interactive Functionality (Add / Delete / Move Items)
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

  // Functions to update Item and Answer Contents
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

  // AI QUESTION GENERATION
  const handleGenerateFullMcq = async (itemId: string) => {
    try {
      // Show AI content warning
      if (!hasUsedAiGeneration) {
        setHasUsedAiGeneration(true);
        setShowAiWarning(true);
      }

      // Extract existing questions
      const existingQuestions = assessmentItems
        .filter((item) => item.type === "MCQ" && item.content.trim() !== "")
        .map((item) => item.content);

      const result = await generateFullMcq({
        assessmentDetails: {
          assessmentTitle,
          assessmentObjectives,
          existingQuestions,
        },
      });

      // Update the question and answers atomically
      return new Promise<void>((resolve) => {
        setAssessmentItems((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId ? { ...item, content: result.question } : item
          )
        );

        setMcqAnswers((currentAnswers) => ({
          ...currentAnswers,
          [itemId]: [
            {
              id: uuidv4(),
              content: result.correctAnswer,
              isCorrect: true,
              assessmentItemId: itemId,
            },
            {
              id: uuidv4(),
              content: result.falseAnswer1,
              isCorrect: false,
              assessmentItemId: itemId,
            },
            {
              id: uuidv4(),
              content: result.falseAnswer2,
              isCorrect: false,
              assessmentItemId: itemId,
            },
            {
              id: uuidv4(),
              content: result.falseAnswer3,
              isCorrect: false,
              assessmentItemId: itemId,
            },
            {
              id: uuidv4(),
              content: result.falseAnswer4,
              isCorrect: false,
              assessmentItemId: itemId,
            },
          ],
        }));

        // Use setTimeout to ensure state updates are processed
        setTimeout(resolve, 0);
      });
    } catch (error) {
      console.error("Error generating MCQ:", error);
      throw error;
    }
  };

  const handleGenerateAnswers = async (itemId: string) => {
    console.log("Generating Answers.");

    const item = assessmentItems.find((item) => item.id === itemId);

    if (!item || item.type !== "MCQ" || !item.content.trim()) {
      console.error("Cannot generate answers: Invalid item or empty question");
      return;
    }

    try {
      // Show AI content warning
      if (!hasUsedAiGeneration) {
        setHasUsedAiGeneration(true);
        setShowAiWarning(true);
      }

      const result = await generateAnswers({
        props: {
          question: item.content,
          assessmentTitle,
        },
      });

      if (mcqAnswers[itemId]) {
        const newAnswers = [
          {
            id: mcqAnswers[itemId][0].id,
            content: result.correctAnswer,
            isCorrect: true,
          },
          {
            id: mcqAnswers[itemId][1].id,
            content: result.falseAnswer1,
            isCorrect: false,
          },
          {
            id: mcqAnswers[itemId][2].id,
            content: result.falseAnswer2,
            isCorrect: false,
          },
          {
            id: mcqAnswers[itemId][3].id,
            content: result.falseAnswer3,
            isCorrect: false,
          },
          {
            id: mcqAnswers[itemId][4].id,
            content: result.falseAnswer4,
            isCorrect: false,
          },
        ];

        newAnswers.forEach((answer) => {
          updateMcqAnswer(itemId, answer.id, {
            content: answer.content,
            isCorrect: answer.isCorrect,
          });
        });
      }
    } catch (error) {
      console.error("Error generating answers:", error);
    }
  };

  const handleGenerateFalseAnswers = async (itemId: string) => {
    const item = assessmentItems.find((item) => item.id === itemId);

    if (!item || item.type !== "MCQ" || !item.content.trim()) {
      console.error(
        "Cannot generate false answers: Invalid item or empty question"
      );
      return;
    }

    const correctAnswer = mcqAnswers[itemId]?.find(
      (answer) => answer.isCorrect
    )?.content;

    if (!correctAnswer) {
      console.error("Cannot generate false answers: No correct answer set");
      return;
    }

    try {
      // Show AI content warning
      if (!hasUsedAiGeneration) {
        setHasUsedAiGeneration(true);
        setShowAiWarning(true);
      }
      const result = await generateFalseAnswers({
        props: {
          question: item.content,
          correctAnswer: correctAnswer,
          assessmentTitle,
        },
      });

      if (mcqAnswers[itemId]) {
        const newAnswers = [
          ...mcqAnswers[itemId].filter((answer) => answer.isCorrect),
          {
            id: mcqAnswers[itemId][1].id,
            content: result.falseAnswer1,
            isCorrect: false,
          },
          {
            id: mcqAnswers[itemId][2].id,
            content: result.falseAnswer2,
            isCorrect: false,
          },
          {
            id: mcqAnswers[itemId][3].id,
            content: result.falseAnswer3,
            isCorrect: false,
          },
          {
            id: mcqAnswers[itemId][4].id,
            content: result.falseAnswer4,
            isCorrect: false,
          },
        ];

        newAnswers.forEach((answer) => {
          updateMcqAnswer(itemId, answer.id, {
            content: answer.content,
            isCorrect: answer.isCorrect,
          });
        });
      }
    } catch (error) {
      console.error("Error generating false answers:", error);
    }
  };

  // FUNCTIONS FOR HANDLING NEW ASSESSMENT CREATION
  const handleCreateFromScratch = () => {
    showNewAssessmentOptionsDialog(false);
    setHasUsedAiGeneration(false);
    addItem("MCQ");
  };

  const handleGenerateMCQs = async () => {
    showNewAssessmentOptionsDialog(false);

    const generateMCQs = async (count: number) => {
      let existingQuestions: string[] = [];

      for (let i = 0; i < count; i++) {
        // Add a new MCQ item and wait for the state to update
        const newItemId = await new Promise<string>((resolve) => {
          addItem("MCQ");
          setTimeout(() => {
            setAssessmentItems((currentItems) => {
              const newItem = currentItems[currentItems.length - 1];
              resolve(newItem.id);
              return currentItems;
            });
          }, 0);
        });

        // Generate full MCQ for the new item
        const result = await generateFullMcq({
          assessmentDetails: {
            assessmentTitle,
            assessmentObjectives,
            existingQuestions,
          },
        });

        // Update the question and answers
        await new Promise<void>((resolve) => {
          setAssessmentItems((currentItems) =>
            currentItems.map((item) =>
              item.id === newItemId
                ? { ...item, content: result.question }
                : item
            )
          );

          setMcqAnswers((currentAnswers) => ({
            ...currentAnswers,
            [newItemId]: [
              {
                id: uuidv4(),
                content: result.correctAnswer,
                isCorrect: true,
                assessmentItemId: newItemId,
              },
              {
                id: uuidv4(),
                content: result.falseAnswer1,
                isCorrect: false,
                assessmentItemId: newItemId,
              },
              {
                id: uuidv4(),
                content: result.falseAnswer2,
                isCorrect: false,
                assessmentItemId: newItemId,
              },
              {
                id: uuidv4(),
                content: result.falseAnswer3,
                isCorrect: false,
                assessmentItemId: newItemId,
              },
              {
                id: uuidv4(),
                content: result.falseAnswer4,
                isCorrect: false,
                assessmentItemId: newItemId,
              },
            ],
          }));

          setTimeout(resolve, 0);
        });

        // Add the new question to existingQuestions
        existingQuestions.push(result.question);
      }
    };

    try {
      await generateMCQs(5);
    } catch (error) {
      console.error("Error generating MCQs:", error);
    }
  };

  // Functions for Handling the Saving / Publishing of Assessments
  const saveDraft = async () => {
    setLoading(true);
    const result = await saveAssessmentItems(
      assessmentId,
      assessmentItems,
      mcqAnswers
    );
    if (result.success) {
      setLoading(false);
      router.push(`/assessments/${assessmentId}`);
    } else {
      setLoading(false);
      alert("Failed to save assessment items. Please try again.");
    }
  };

  const saveLive = async () => {
    setPublishLoading(true);
    const result = await saveAssessmentItems(
      assessmentId,
      assessmentItems,
      mcqAnswers
    );
    const setLive = await setAssessmentLive(assessmentId);
    if (result.success && setLive) {
      setPublishLoading(false);
      router.push(`/assessments/${assessmentId}`);
    } else {
      setPublishLoading(false);
      alert("Failed to save assessment items. Please try again.");
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    const result = await saveAssessmentItems(
      assessmentId,
      assessmentItems,
      mcqAnswers
    );
    if (result.success) {
      setLoading(false);
      router.push(`/assessments/preview/${assessmentId}`);
    } else {
      setLoading(false);
      alert("Failed to save assessment items. Please try again.");
    }
  };

  // RETURN STATMENTS
  return (
    <div className="flex flex-col gap-y-4 w-full py-1">
      <NewAssessmentDialog
        open={newAssessmentOptionsDialog}
        onClose={() => showNewAssessmentOptionsDialog(false)}
        onCreateFromScratch={handleCreateFromScratch}
        onGenerateMCQs={handleGenerateMCQs}
      />
      <AIWarningDialog
        open={showAiWarning}
        onClose={() => setShowAiWarning(false)}
      />
      <Card className="p-2">
        <div className="flex justify-between items-center py-2">
          <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-bold w-[25rem]">{assessmentTitle}</h2>
            <p>
              Class: {classId.toUpperCase()} - {classTitle}
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex space-x-4 justify-end">
              <Button variant="outline" onClick={handlePreview}>
                {loading ? (
                  <div className="px-2">
                    <LoadingSpinner />
                  </div>
                ) : (
                  "Preview"
                )}
              </Button>
              <Button variant={"destructive"} onClick={saveDraft}>
                {loading ? (
                  <div className="px-2">
                    <LoadingSpinner />
                  </div>
                ) : (
                  "Close"
                )}
              </Button>
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
      </Card>
      
      {/* MAP OVER ASSESSMENT ITEMS */}
      {assessmentItems.map((item, index) => (
        <Card key={item.id} className="flex flex-col border-2 p-2 w-full">
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
                <Trash />
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
            onGenerateFullMcq={() => handleGenerateFullMcq(item.id)}
            onGenerateAnswers={() => handleGenerateAnswers(item.id)}
            onGenerateFalseAnswers={() => handleGenerateFalseAnswers(item.id)}
          />
        </Card>
      ))}
      <div className="flex gap-x-2 justify-center">
        <Button onClick={() => addItem("CONTEXT")}>Add Context</Button>
        <Button onClick={() => addItem("MCQ")}>Add MCQ</Button>
      </div>

      <div className="flex gap-x-4 justify-end mt-4">
        <Button
          onClick={saveDraft}
          className="bg-yellow-300 text-black hover:bg-yellow-600"
        >
          Save As Draft
          {loading && (
            <div className="pl-4">
              <LoadingSpinner />
            </div>
          )}
        </Button>
        <Button
          onClick={saveLive}
          className="bg-green-300 hover:bg-green-600 text-black hover:text-white"
          data-id="publish-assessment"
        >
          Publish
          {publishLoading ? (
            <div className="pl-4">
              <LoadingSpinner />
            </div>
          ) : (
            " Assessment"
          )}
        </Button>
      </div>
    </div>
  );
}

export default AssessmentEditor;
