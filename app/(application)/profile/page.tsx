import { getCurrentUser } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

import DeleteProfileDialog from "@/components/profile/DeleteProfileDialog";
import UpdateUserDialog from "@/components/profile/UpdateUserDialog";
import UserDetails from "@/components/profile/UserDetails";
import { Card } from "@/components/ui/card";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/onboard");
  }

  return (
    <div className="flex flex-col w-full max-w-4xl gap-y-4 py-4">
      <Card className="p-4 flex flex-col gap-y-4">
      <div className="flex w-full justify-between px-1 items-center">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <div className="flex gap-x-4">  
          <UpdateUserDialog user={user} />
          <DeleteProfileDialog />
        </div>
      </div>
      <UserDetails user={user} />
      </Card>
    </div>
  );
}



