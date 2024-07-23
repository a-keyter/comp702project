import CreateClassDialog from "@/components/classesTable/CreateClassDialog";
import { getUserDetails } from "@/lib/actions/getUserDetails";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUserDetails();
  if (!user) {
    return redirect('/onboard');
  }

  return (
    <div className="w-full max-w-4xl flex flex-col space-y-4">
      <p>Welcome back {user.nickname}!</p>
      <div className="w-full h-60 bg-slate-300 flex justify-between">
        <p>Small Classes Table</p>
        <CreateClassDialog />
      </div>
      <div className="w-full h-60 bg-slate-300">Small Assessments Table </div>
    </div>
  );
}
