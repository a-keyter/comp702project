"use client";

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Ban, Plus } from "lucide-react";
import { addUserToClass } from "@/lib/issueUtils/addUserToClass";
import { rejectJoinRequest } from "@/lib/issueUtils/rejectJoinRequest";

type JoinRequestActionsProps = {
  issueId: string;
  userEmail: string;
  userName: string;
  classId: string;
  className: string;
};

export default function JoinRequestActions({
  issueId,
  userEmail,
  userName,
  classId,
  className,
}: JoinRequestActionsProps) {
  const router = useRouter();

  const handleAddUser = async () => {
    try {
      await addUserToClass(issueId, userEmail, classId);
      toast({
        title: "Success",
        description: `${userName} has been added to ${className}`,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding user to class:", error);
      toast({
        title: "Error",
        description: "Failed to add user to class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async () => {
    try {
      await rejectJoinRequest(issueId);
      toast({
        title: "Success",
        description: `Join request from ${userName} has been rejected`,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error rejecting join request:", error);
      toast({
        title: "Error",
        description: "Failed to reject join request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-start gap-x-4 pt-1">
      <button 
        className="bg-green-600 px-1 rounded-lg hover:bg-green-300" 
        title="Add to class"
        onClick={handleAddUser}
      >
        <Plus className="h-6 w-6 text-white"/>
      </button>
      <button 
        className="bg-red-600 px-1 py-1 rounded-lg hover:bg-red-300" 
        title="Reject request"
        onClick={handleRejectRequest}
      >
        <Ban className="h-6 w-6 text-black"/>
      </button>
    </div>
  );
}