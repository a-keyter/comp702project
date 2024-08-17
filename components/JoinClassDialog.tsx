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
import LoadingSpinner from "./LoadingSpinner";
import { addUserToClass } from "@/lib/classUtils/addUserToClass";
import { Link2 } from "lucide-react";
import { joinClassRequest } from "@/lib/issueUtils/joinClassRequest";
import { useToast } from "./ui/use-toast";

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
      message: "Class code must contain only alphanumeric characters and hyphens (No spaces).",
    }),
});

function JoinClassDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classCode: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    try {
      const request = await joinClassRequest(data.classCode);

      if (request.outcome === "success") {
        setOpen(false); // Close the dialog on success
        toast({
          title: "Success",
          description: request.message,
          variant: "default",
        });
      } else {
        setOpen(false); // Close the dialog on failure
        toast({
          title: "Error",
          description: request.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error joining class:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      form.reset(); // Reset the form after submission (success or failure)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default"><Link2 className="pr-2"/>Join Class</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Class</DialogTitle>
          <DialogDescription>
            Enter the class code to join a new class.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="classCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Code (6 to 8 characters)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the unique code for the class you want to join.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">
                Join Class
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

export default JoinClassDialog;