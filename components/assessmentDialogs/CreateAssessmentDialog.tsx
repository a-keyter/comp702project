"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { format, setHours, setMinutes } from "date-fns";

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
import LoadingSpinner from "../LoadingSpinner";
import { createNewAssessment } from "@/lib/assessmentUtils/createNewAssessment";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SafeClass } from "@/lib/classUtils/getClassDetails";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "../ui/calendar";

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
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  objectives: z.string().min(10, {
    message: "Learning objectives must be at least 10 characters.",
  }),
});

function CreateAssessmentDialog({
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
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classId: classId ? classId : "",
      title: "",
      objectives: "",
      dueDate: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return setHours(setMinutes(tomorrow, 0), 17);
      })(),
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setError(null);
      setLoading(true);

      // Call the createNewClass function
      const assessCode = await createNewAssessment(data);

      // Reload the page to show the new class
      router.push(`/assessments/edit/${assessCode}`);

      // Close the dialog if successful
      setLoading(false);
      setOpen(false);
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
        {variant === "icon" ? (
          <button
            title="New Assessment"
            className="rounded-full p-1 bg-black"
            data-id="new-assessment-dialog"
          >
            <Plus className="h-5 w-5 text-white" />
          </button>
        ) : (
          <Button data-id="new-assessment-dialog">
            <Plus className="pr-2" /> New{" "}
          </Button>
        )}
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
                          <SelectValue placeholder="Select the class for the assignment" />
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
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          data-id="date-picker"
                          variant={"outline"}
                          className={cn(
                            "w-[full] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const dateAt5PM = setHours(setMinutes(date, 0), 17);
                            field.onChange(dateAt5PM);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Set the due date for the assessment. The time will default
                    to 5:00 PM.
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
