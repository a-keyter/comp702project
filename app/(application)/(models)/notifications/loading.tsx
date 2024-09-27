import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-4xl flex flex-col gap-y-4 flex-1">
      <Card className="p-2 h-full"><Skeleton className="h-full w-full" /></Card>
    </div>
  );
}
