"use client";

import { useState } from "react";
import { removeStudentByNickname } from "@/lib/studentUtils/removeStudentByNickname";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function LeaveClassDialog({
  studentNickname,
  classId,
}: {
  studentNickname: string;
  classId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const result = await removeStudentByNickname(studentNickname, classId);
      toast({
        title: "Success",
        description: result.message,
        variant: "default",
      });
      setTimeout(() => {
        window.location.assign("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = "An error occurred while removing the student.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Leave Class</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to leave this
            class ({classId})?? All submission data will be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-x-4 justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleRemove} disabled={isLoading}>
            {isLoading ? "Removing..." : "Confirm"}
          </Button>{" "}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
