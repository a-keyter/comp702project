import { z } from "zod";

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
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    objectives: z.string().min(10, {
      message: "Learning objectives must be at least 10 characters.",
    }),
  });


type FormData = z.infer<typeof FormSchema>;

export async function createNewAssessment(formData: FormData) {
    console.log(formData)
    return ("hello-world")
}