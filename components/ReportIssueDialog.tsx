"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "./LoadingSpinner";
import { TriangleAlert } from "lucide-react";
import { SubmittedResponse } from "@/lib/assessmentUtils/getSubmissionResults";
import { toast } from "./ui/use-toast";
import { raiseFeedbackIssue } from "@/lib/issueUtils/raiseFeedbackIssue";
import { raiseQuestionIssue } from "@/lib/issueUtils/raiseQuestionIssue";

const FormSchema = z.object({
  issueDescription: z.string().min(10, {
    message: "Issue description must be at least 10 characters.",
  }),
});

interface ReportIssueProps {
  issueItemId: string; // SubmissionId for Feedback or ResponseId for Question.
  issueType: string; // "Feedback" | "Question"
  issueObject: null | string | SubmittedResponse;
}

export default function ReportIssueDialog({
  issueItemId,
  issueType,
  issueObject,
}: ReportIssueProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      issueDescription: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    try {
      let result;
      if (issueType === "Feedback") {
        if (typeof issueObject !== "string") {
          throw new Error("Feedback is required for Feedback issues");
        }
        result = await raiseFeedbackIssue(issueItemId, issueObject, data.issueDescription);
      } else {
        if (!issueObject || typeof issueObject === "string") {
          throw new Error("SubmittedResponse object is required for Question issues");
        }
        result = await raiseQuestionIssue(
          issueObject.responseId,
          data.issueDescription,
          issueObject.question,
          issueObject.correctAnswer,
          issueObject.givenAnswer
        );
      }

      if (result.outcome === "success") {
        setOpen(false);
        form.reset();
        toast({
          title: "Success",
          description: result.message,
          variant: "default",
        });
      } else {
        setOpen(false);
        form.reset();
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(`Error reporting ${issueType.toLowerCase()} issue:`, err);
      toast({
        title: "Error",
        description: `An unexpected error occurred while reporting the ${issueType.toLowerCase()} issue. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title={`Report Issue with ${issueType.toLowerCase()}`} variant="default" className="rounded-full">
          <TriangleAlert />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Please describe the issue you are experiencing with the{" "}
            {issueType.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        {issueType === "Feedback" && typeof issueObject === "string" && (
          <div className="p-2 bg-yellow-200 rounded-lg">
            <h3 className="font-semibold text-sm mb-1">Given Feedback</h3>
            <p>{issueObject}</p>
          </div>
        )}
        {issueType === "Question" && issueObject && (
          <div className="p-2 bg-yellow-200 rounded-lg">
            <p>
              <strong>Question:</strong>{" "}
              {(issueObject as SubmittedResponse).question}
            </p>
            <div className="mt-2">
              <p>
              <strong>Correct Answer:</strong>
              <ul className="list-disc pl-5">
                <li >
                  {(issueObject as SubmittedResponse).correctAnswer}
                </li>
              </ul>
              </p>
              <p className="mt-2">
              <strong>Your Answer:</strong>
              <ul className="list-disc pl-5">
                <li>{(issueObject as SubmittedResponse).givenAnswer}</li>
              </ul>
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="issueDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe the issue..." />
                  </FormControl>
                  <FormDescription>
                    Provide details about the problem you are encountering.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                Submit Issue
                {loading && (
                  <div className="pl-4">
                    <LoadingSpinner />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
