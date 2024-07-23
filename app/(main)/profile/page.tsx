
import UserDetails from "@/components/UserDetails";
import { getUserDetails } from "@/lib/actions/getUserDetails";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getUserDetails();
  if (!user) {
    return redirect('/onboard');
  }
  return (
    <div className="flex flex-col w-full max-w-4xl gap-y-4 items-center">
      <UserDetails user={user} />
      <div className="w-full h-60 bg-slate-300">Small Classes Table </div>
    </div>
  );
}
