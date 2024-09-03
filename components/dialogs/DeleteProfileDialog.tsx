"use client";

import React, { useState } from "react";
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
import LoadingSpinner from "../LoadingSpinner";
import { deleteUserByNickname } from "@/lib/userUtils/deleteUserByNickname";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Import the deleteUserByNickname function
const FormSchema = z.object({
  confirmPhrase: z.string().min(1),
});

function DeleteProfileDialog({ nickname }: { nickname: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirmPhrase: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.confirmPhrase !== "delete-my-profile") {
      setError("Incorrect confirmation phrase.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Call the deleteUserByNickname function
      const result = await deleteUserByNickname(nickname);

      setLoading(false);
      setOpen(false);

      router.push("/");

      // Log the user out
      await signOut();

    } catch (err) {
      setLoading(false);
      console.error("Error deleting profile:", err);
      setError(
        "An error occurred while deleting your profile. Please try again."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Profile</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your profile? <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="confirmPhrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm deletion by typing 'delete-my-profile'
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Type "delete-my-profile"' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                data-id="delete-profile-btn"
              >
                Delete Profile
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

export default DeleteProfileDialog;
