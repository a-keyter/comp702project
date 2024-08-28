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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import { SafeClass } from "@/lib/classUtils/getClassDetails";
import { updateClassDetails } from "@/lib/classUtils/updateClassDetails";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

function UpdateClassDialog({ classData }: { classData: SafeClass }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: classData.title,
      description: classData.description,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setError(null);
      setLoading(true);

      // Call the updateClassDetails function (you'll need to implement this)
      await updateClassDetails(classData.id, data);

      setLoading(false);
      setOpen(false);

      // Reload the page to show update
      router.refresh();
    } catch (err) {
      setLoading(false);
      console.error("Error updating class details:", err);
      setError("An error occurred while updating the class. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Edit Class</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Make changes to your class here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <p className="text-sm">Class Code</p>
              <Input
                title="You cannot change the class code."
                disabled
                placeholder={classData.id}
              ></Input>
            </div>
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
                    This is the title of your class.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your class.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">
                Save changes
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

export default UpdateClassDialog;
