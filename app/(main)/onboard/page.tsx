import { OnboardForm } from "@/components/OnboardForm"

function OnboardPage() {
  return (
    <div className='flex flex-col w-full max-w-4xl gap-y-4 items-center'>
        <h2 className='font-semibold text-xl'>Welcome to Ambi-Learn!</h2>
        <p>Lets get started by finding out a bit more about you!</p>
        <OnboardForm/>
    </div>
  )
}

export default OnboardPage

