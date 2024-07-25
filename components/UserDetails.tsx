'use client';

import { Card, CardTitle } from "@/components/ui/card";
import UserDetailsDialog from "./UserDetailsDialog";
import { SafeUser } from "@/lib/userUtils/getUserDetails";

function UserDetails({ user }: { user: SafeUser }) {
  return (
    <Card className="p-2 flex flex-col gap-y-4 w-full max-w-2xl">
      <CardTitle>User Details</CardTitle>
      <div className="flex justify-between">
        <div>
          <p>Name: {user.name}</p>
          <p>Nickname: {user.nickname}</p>
          <p>Role: {user.role}</p>
        </div>
        <UserDetailsDialog user={user} />
      </div>
    </Card>
  );
}

export default UserDetails;