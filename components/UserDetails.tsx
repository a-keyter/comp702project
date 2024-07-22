import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserDetailsDialog from "./UserDetailsDialog";

function UserDetails() {
  return (
    <Card className="p-2 flex flex-col gap-y-4 w-full max-w-2xl">
      <CardTitle>User Details</CardTitle>
      <div className="flex justify-between">
        <div>
          <p>Name: {"Test User"}</p>
          <p>Username: {"Test_User_123"}</p>
          <p>Role: {"Teacher"}</p>
        </div>
        <UserDetailsDialog/>
      </div>
    </Card>
  );
}

export default UserDetails;
