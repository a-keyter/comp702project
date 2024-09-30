
import { Card } from "@/components/ui/card";

import { SafeUser } from "@/lib/userUtils/getUserDetails";

function UserDetails({ user }: { user: SafeUser }) {
  return (
    <Card className="p-2 flex flex-col gap-y-2 w-full max-w-4xl mx-auto">
      
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


