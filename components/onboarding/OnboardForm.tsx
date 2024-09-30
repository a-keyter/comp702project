"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Switch } from "../ui/switch";
import { useState } from "react";
import { createUser } from "@/lib/userUtils/createNewUser";
import LoadingSpinner from "../LoadingSpinner";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  nickname: z.string().min(2, {
    message: "Nickname must be at least 2 characters.",
  }).regex(/^[a-zA-Z0-9-]+$/, {
    message: "Nickname must contain only alphanumeric characters (No spaces).",
  }),
  teachermode: z.boolean().default(false).optional(),
}); 

export function OnboardForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      nickname: "",
      teachermode: false,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setError(null);
      setLoading(true)

      // Call the createUser function
      await createUser(data);

      setLoading(false)
      // If successful, redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      // Handle any errors
      setLoading(false)
      console.error("Error creating user:", err);
      setError(
        "An error occurred while creating your profile. Please try again."
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Clark Kent" {...field} />
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
              <FormLabel>Nickname (Alphanumerical Characters Only)</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is used to create a link to your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teachermode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between w-full">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Teacher Mode?</FormLabel>
                <FormDescription className="pr-4">
                  Teachers can create classes and assessments. <br />
                  Do not use this mode if you are not a teacher.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="w-full flex flex-col gap-y-2 justify-center">
          <Button type="submit">Lets get started!{loading && <div className="pl-4"><LoadingSpinner/></div>}</Button>
          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </Form>
  );
}
