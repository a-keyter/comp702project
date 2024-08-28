"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SafeUser } from "@/lib/userUtils/getUserDetails";

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
import { updateUserDetails } from "@/lib/userUtils/updateUserDetails";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  nickname: z.string().min(2, {
    message: "Nickname must be at least 2 characters.",
  }),
});

function UpdateUserDialog({ user }: { user: SafeUser }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user.name,
      nickname: user.nickname,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setError(null);
      setLoading(true)

      // Call the updateUserDetails function
      await updateUserDetails(data);

      // Close the dialog if successful
      setLoading(false)
      setOpen(false);

      // Reload the page to show update
      router.refresh();

    } catch (err) {
      setLoading(false)
      console.error("Error updating user details:", err);
      setError("An error occurred while updating your profile. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. <br /> Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This name is used to identify your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is used to create a link to your profile. <br />(Alphanumerical characters Only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Save changes{loading && <div className="pl-4"><LoadingSpinner/></div>}</Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateUserDialog;