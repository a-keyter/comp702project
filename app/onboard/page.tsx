import { OnboardForm } from "@/components/OnboardForm"
import { Card } from "@/components/ui/card"
import { getUserById } from "@/lib/userUtils/getUserDetails"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

async function OnboardPage() {

  const {userId} = auth()
  if (!userId) {
    redirect("/")
  }

  const user = await getUserById(userId)

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className='flex flex-col h-screen w-full gap-y-4 items-center justify-center'>
      <Card className="flex flex-col gap-y-4 p-8">
        <h2 className='font-semibold text-xl'>Welcome to Ambi-Learn!</h2>
        <p>Lets get started by finding out a bit more about you!</p>
        <OnboardForm/>
      </Card>
    </div>
  )
}

export default OnboardPage
