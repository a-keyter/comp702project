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
import { ResultResponse } from "./assessmentAttempt/ResultItemWrapper";

const FormSchema = z.object({
  issueDescription: z.string().min(10, {
    message: "Issue description must be at least 10 characters.",
  }),
});

interface ReportIssueProps {
  issueItemId: string;
  issueType: string; // "Feedback" | "Question"
  issueObject: null | string | ResultResponse;
}

export default function ReportIssueDialog({
  issueItemId,
  issueType,
  issueObject,
}: ReportIssueProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [issueId, setIssueId] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      issueDescription: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setError("");
      setLoading(true);

      // Here you would typically call an API to create the issue
      // For this example, we'll simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate getting an issueId back from the API
      const newIssueId = "issue_" + Math.random().toString(36).substr(2, 9);
      setIssueId(newIssueId);

      // Simulate sending the first message
      //   await fetchIssueMessages(newIssueId);

      setLoading(false);
      form.reset();
    } catch (err) {
      setLoading(false);
      setError(
        "An error occurred while reporting the issue. Please try again."
      );
      console.error("Error reporting issue:", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title="Report Issue" variant="default" className="rounded-full">
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
              {(issueObject as ResultResponse).question}
            </p>
            <div className="mt-2">
              <p>
              <strong>Correct Answer:</strong>
              <ul className="list-disc pl-5">
                <li >
                  {(issueObject as ResultResponse).correctAnswer}
                </li>
              </ul>
              </p>
              <p className="mt-2">
              <strong>Your Answer:</strong>
              <ul className="list-disc pl-5">
                <li>{(issueObject as ResultResponse).givenAnswer}</li>
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {issueId && (
              <p className="text-green-500 text-sm">
                Issue reported successfully. Issue ID: {issueId}
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
