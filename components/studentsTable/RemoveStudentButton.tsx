"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { removeStudentByNickname } from "@/lib/studentUtils/removeStudentByNickname";

function RemoveStudentButton({
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
        window.location.reload();
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
    <Button onClick={handleRemove} disabled={isLoading}>
      {isLoading ? "Removing..." : "Confirm"}
    </Button>
  );
}

export default RemoveStudentButton;
