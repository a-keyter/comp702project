"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "./LoadingSpinner";
import { createNewAssessment } from "@/lib/assessmentUtils/createNewAssessment";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SafeClass } from "@/lib/classUtils/getClassDetails";

const FormSchema = z.object({
  classCode: z
    .string()
    .min(6, {
      message: "Class code must be at least 6 characters.",
    })
    .max(8, {
      message: "Class code must be 8 characters at most.",
    })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message:
        "Class code must contain only alphanumeric characters and hyphens (No spaces).",
    }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  objectives: z.string().min(10, {
    message: "Learning objectives must be at least 10 characters.",
  }),
});

function CreateAssessmentDialog({
  classCode,
  classTitle,
  classes,
}: {
  classCode: string | null;
  classTitle: string | null;
  classes: SafeClass[] | null;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classCode: classCode ? classCode : "",
      title: "",
      objectives: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setError(null);
      setLoading(true);

      // Call the createNewClass function (to be implemented)
      const assessCode = await createNewAssessment(data);

      // Close the dialog if successful
      setLoading(false);
      setOpen(false);

      // Reload the page to show the new class
      router.push(`/assessments/edit/${assessCode}`);
    } catch (err) {
      setLoading(false);
      console.error("Error creating new assessment:", err);
      setError(
        "An error occurred while creating the assessment. Please try again."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ New Assessment </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
          <DialogDescription>
            Enter the details for your new Assessment. Click create when you are
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="classCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={classCode || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {classes ? (
                          <SelectValue placeholder="Select the class for the assignment" />
                        ) : (
                          <SelectValue
                            placeholder={`${classCode} - ${classTitle}`}
                          />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes
                        ? classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {`${classItem.id} - ${classItem.title}`}
                            </SelectItem>
                          ))
                        : classCode &&
                          classTitle && (
                            <SelectItem value={classCode}>
                              {`${classCode} - ${classTitle}`}
                            </SelectItem>
                          )}
                    </SelectContent>
                  </Select>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The title of the assessment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectives</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    The learning objectives of the assessment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">
                Create Assessment
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

export default CreateAssessmentDialog;
