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
import { redirect } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import { deleteClass } from "@/lib/classUtils/deleteClass";

function DeleteClassDialog({
  classId,
  classTitle,
}: {
  classId: string;
  classTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const FormSchema = z.object({
    confirmClassId: z
      .string()
      .min(1)
      .refine((val) => val === classId, {
        message: "Class ID does not match.",
      }),
    confirmPhrase: z.string().min(1),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirmClassId: "",
      confirmPhrase: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.confirmPhrase !== "delete-this-class") {
      setError("Incorrect Confirmation Phrase.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Call the deleteClass function (you'll need to implement this)
      await deleteClass(classId);

      setLoading(false);
      setOpen(false);

      // Redirect to a different page after deletion
      redirect("/dashboard")
    } catch (err) {
      setLoading(false);
      console.error("Error deleting class:", err);
      setError("An error occurred while deleting the class. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Class</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the class {classTitle}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="confirmClassId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm the Class ID &apos;{classId}&apos;</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the class ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPhrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Deletion by typing &apos;delete-this-class&apos;</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Type "delete-this-class"' />
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
                Delete Class
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

export default DeleteClassDialog;
