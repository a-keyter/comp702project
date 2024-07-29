import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function StudentPage({ params }: { params: { id: string } }) {
    const user = await getUserDetails();
  
    if (!user) {
      return redirect("/onboard");
    }

    if (user.role !== "TEACHER") {
        return redirect("/dashboard")
    }

    return (
    <div>This page is for showing the performance of an individual student. {params.id}.</div>
  )
}

export default StudentPage