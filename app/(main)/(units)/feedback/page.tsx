import { getUserDetails } from "@/lib/actions/getUserDetails";
import { redirect } from "next/navigation";

async function page() {
  const user = await getUserDetails();
  if (!user) {
    return redirect("/onboard");
  }
  return <div>Feedback Table</div>;
}

export default page;
