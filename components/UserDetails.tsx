"use client";

import { Card, CardTitle } from "@/components/ui/card";
import UpdateUserDialog from "./profileDialogs/UpdateUserDialog";
import { SafeUser } from "@/lib/userUtils/getUserDetails";
import DeleteProfileDialog from "./profileDialogs/DeleteProfileDialog";

function UserDetails({ user }: { user: SafeUser }) {
  return (
    <Card className="p-2 flex flex-col gap-y-2 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <CardTitle>User Details</CardTitle>
        <div className="flex gap-x-2">
          <DeleteProfileDialog nickname={user.nickname} />
          <UpdateUserDialog user={user} />
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <p>Name: {user.name}</p>
          <p>Nickname: {user.nickname}</p>
        </div>
        <div>
          <p>Role: {user.role.charAt(0) + user.role.slice(1).toLowerCase()}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </Card>
  );
}

export default UserDetails;
