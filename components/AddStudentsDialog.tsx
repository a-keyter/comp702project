"use client";

import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "./LoadingSpinner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SafeClass } from "@/lib/classUtils/getClassDetails";
import { Plus } from "lucide-react";
import { toast } from "./ui/use-toast";
import bulkAddStudentsToClass from "@/lib/teacherUtils/bulkAddStudents";

const FormSchema = z.object({
  classId: z
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
  studentEmails: z.array(z.string().email("Invalid email address")),
});

function AddStudentsDialog({
  classId,
  classTitle,
  classes,
  variant,
}: {
  classId: string | null;
  classTitle: string | null;
  classes: SafeClass[] | null;
  variant: "icon" | "text";
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [studentEmails, setStudentEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classId: classId ? classId : "",
      studentEmails: [],
    },
  });

  useEffect(() => {
    form.setValue("studentEmails", studentEmails);
  }, [studentEmails, form]);

  const processInput = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newEmails = input
      .split(/[\s,\t\n]+/)
      .map((email) => email.trim())
      .filter(
        (email) =>
          email && !studentEmails.includes(email) && emailRegex.test(email)
      );

    if (newEmails.length > 0) {
      setStudentEmails((prev) => [...prev, ...newEmails]);
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.endsWith(" ") || value.endsWith(",") || value.endsWith("\n")) {
      processInput(value);
    }
  };

  const handleInputBlur = () => {
    processInput(inputValue);
  };

  const removeEmail = (emailToRemove: string) => {
    setStudentEmails((prev) => prev.filter((email) => email !== emailToRemove));
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setError(null);
      setLoading(true);

      // add all students to the class
      await bulkAddStudentsToClass(data.classId, data.studentEmails);

      // Close the dialog if successful
      setLoading(false);
      setOpen(false);
      setStudentEmails([])
      toast({
        title: "Success",
        description: "Students have been successfully added to the class.",
        variant: "default",
      })
      // Reload the page or update the UI to reflect the changes
      router.refresh();
    } catch (error) {
      setLoading(false);
      console.error("Error adding students to class:", error);
      setError(
        "An error occurred while adding students to the class. Please try again."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <button title="Add Students" className="rounded-full p-1 bg-black">
            <Plus className="h-5 w-5 text-white" />
          </button>
        ) : (
          <Button>Add Students</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Students to Class</DialogTitle>
          <DialogDescription>
            Enter the email addresses of the students you want to add to the
            class.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={classId || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {classes ? (
                          <SelectValue placeholder="Select the class to add students to" />
                        ) : (
                          <SelectValue
                            placeholder={`${classId} - ${classTitle}`}
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
                        : classId &&
                          classTitle && (
                            <SelectItem value={classId}>
                              {`${classId} - ${classTitle}`}
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
              name="studentEmails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Emails</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter student email addresses"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="max-h-[200px] overflow-y-auto">
              {studentEmails.length > 0 && (
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3">
                  Emails to be added:
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {studentEmails.map((email) => (
                  <Badge key={email} variant="default">
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="ml-2 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                Add Students
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

export default AddStudentsDialog;
