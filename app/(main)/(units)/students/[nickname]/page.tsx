import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import { redirect } from "next/navigation";

async function IndividualStudentPage({ params }: { params: { nickname: string } }) {
    const user = await getUserDetails();
  
    if (!user) {
      return redirect("/onboard");
    }

    if (user.role !== "TEACHER") {
        return redirect(`/classes`)
    }

    return (
    <div>This page is for showing an individual student that is a member of the teachers classes.</div>
  )
}

export default IndividualStudentPage