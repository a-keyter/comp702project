import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function ClassStudentsPage({ params }: { params: { id: string } }) {
    const user = await getUserDetails();
  
    if (!user) {
      return redirect("/onboard");
    }

    if (user.role !== "TEACHER") {
        return redirect(`/classes/${params.id}`)
    }

    return (
    <div>This page is for showing the students within a given class: {params.id}.</div>
  )
}

export default ClassStudentsPage