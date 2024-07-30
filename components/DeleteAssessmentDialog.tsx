"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { deleteAssessment } from "@/lib/assessmentUtils/deleteAssessment";

function DeleteAssessmentDialog({
  assessmentId,
  assessmentTitle,
}: {
  assessmentId: string;
  assessmentTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const FormSchema = z.object({
    confirmPhrase: z.string().min(1),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirmPhrase: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.confirmPhrase !== "delete-this-assessment") {
      setError("Incorrect Confirmation Phrase.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Call the deleteAssessment function (you'll need to implement this)
      await deleteAssessment(assessmentId);

      setLoading(false);
      setOpen(false);

      // Redirect to a different page after deletion
      router.push("/assessments");
    } catch (err) {
      setLoading(false);
      console.error("Error deleting assessment:", err);
      setError("An error occurred while deleting the assessment. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Assessment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the assessment &quot;{assessmentTitle}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="confirmPhrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Deletion by typing &apos;delete-this-assessment&apos;</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Type "delete-this-assessment"' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="default"
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Delete Assessment
                {loading && (
                  <div className="pl-4">
                    <LoadingSpinner />
                  </div>
                )}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteAssessmentDialog;