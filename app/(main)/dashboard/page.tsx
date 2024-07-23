import { getUserById } from "@/lib/actions/getUserById";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Dashboard() {
  const { userId } = auth();
  if (userId) {
    // Query DB for user specific information
    const currentProfile = await getUserById(userId)
    if (!currentProfile) {
      return redirect('/onboard');
    }
  }
  
  
  return (
    <div className="w-full max-w-4xl flex flex-col gap-y-6">
      <div className="w-full h-60 bg-slate-300">Small Classes Table</div>
      <div className="w-full h-60 bg-slate-300">Small Assessments Table </div>
    </div>
  );
}
