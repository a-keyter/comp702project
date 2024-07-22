
import UserDetails from "@/components/UserDetails";

function page() {
  return (
    <div className="flex flex-col w-full max-w-4xl gap-y-4 items-center">
      <UserDetails/>
      <div className="w-full h-60 bg-slate-300">Small Classes Table </div>
    </div>
  );
}

export default page;
