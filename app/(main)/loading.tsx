import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-4xl flex flex-col gap-y-4">
      <Card className="p-2"><Skeleton className="h-60 w-full" /></Card>
      <Card className="p-2"><Skeleton className="h-60 w-full" /></Card>
    </div>
  );
}
