import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function IssuesPage() {

    return (
        <div className="flex flex-col gap-y-4 w-full max-w-4xl h-full">
            <Card className="p-2 h-60 w-full flex flex-col gap-y-2">
                <h2 className="text-xl font-semibold">Join Class Requests</h2>
                <div className="bg-slate-400 rounded-lg flex-1">Imagine a table here...</div>
            </Card>
            <Card className="p-2 flex-grow w-full flex flex-col gap-y-2">
                <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Question / Feedback Issues</h2>
                <Link href="/issues/archive"><Button>Archive</Button></Link>
                </div>
                <div className="bg-slate-400 rounded-lg flex-1">Imagine a table here...</div>
            </Card>
            
        </div>
    )
    
}