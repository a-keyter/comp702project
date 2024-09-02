import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Sparkle } from "lucide-react";

interface NewAssessmentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateFromScratch: () => void;
  onGenerateMCQs: () => void;
}

const NewAssessmentDialog: React.FC<NewAssessmentDialogProps> = ({
  open,
  onClose,
  onCreateFromScratch,
  onGenerateMCQs,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to start creating your assessment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            data-id="ai-generate-mcqs"
            className="hover:bg-slate-400 p-4 rounded-lg border-slate-300 border-2"
            onClick={onGenerateMCQs}
          >
            <div className="flex flex-col gap-y-4 items-center">
              <Sparkle />
              <p>Use GPT-4.0 to generate MCQs</p>
            </div>
          </button>

          {/* TODO - Enable user to upload PDF and generate MCQs */}
          {/* <button
            className="hover:bg-slate-400 p-4 rounded-lg border-slate-300 border-2"
            onClick={onUploadPDF}
          >
            <div className="flex flex-col gap-y-4 items-center">
              <UploadCloud />
              <p>Use a PDF & AI to generate MCQs</p>
            </div>
          </button> */}

          <button
            className="hover:bg-slate-400 p-4 rounded-lg border-slate-300 border-2"
            onClick={onCreateFromScratch}
          >
            <div className="flex flex-col gap-y-4 items-center">
              <Pencil />
              <p>Create a blank assessment</p>
            </div>
          </button>
        </div>
        <p className="text-sm text-center  bg-yellow-200 rounded-lg  px-8 py-2 mx-auto">
          {" "}
          <strong>*</strong>
          AI-generated content may not be accurate. <br />
          Always check AI-generated content.
        </p>
        <DialogFooter className="flex flex-col">
          <div>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAssessmentDialog;
