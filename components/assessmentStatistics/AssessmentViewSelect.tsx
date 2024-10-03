import TeacherFeedback from "@/components/assessmentStatistics/TeacherFeedback";
import HardestQuestions from "@/components/assessmentStatistics/HardestQuestions";
import PerformanceGraph from "@/components/assessmentStatistics/PerformanceGraph";
import {
  responseColumns,
  ResponseWithUser,
} from "@/components/submissionsTable/columns";
import { AllResponsesDataTable } from "@/components/submissionsTable/data-table";
import {
  Card,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";

interface AssessmentViewSelectProps {
  results: ResponseWithUser[];
  assessmentId: string;
  averageScore: number;
  submissionCount: number;
  membersCount: number;
  latestSubmissionId: string | null;
}

export function AssessmentViewSelect({
  results, assessmentId, averageScore, submissionCount, membersCount, latestSubmissionId,
}:
   AssessmentViewSelectProps
) {
  return (
    <Tabs defaultValue="submissions" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="submissions" className="col-span-1">
          Submissions
        </TabsTrigger>
        <TabsTrigger
          value="statistics"
          className="col-span-1 flex items-center"
          disabled={results.length === 0}
        >
          Statistics {results.length === 0 && <Lock className="h-6 w-6 pl-2"/>}
        </TabsTrigger>
        <TabsTrigger
          value="analysis"
          className="col-span-1 flex items-center"
          disabled={results.length === 0}
        >
          AI Feedback {results.length === 0 && <Lock className="h-6 w-6 pl-2"/>}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="submissions">
        <Card>
          <AllResponsesDataTable
            columns={responseColumns}
            data={results}
          />
        </Card>
      </TabsContent>
      <TabsContent value="statistics">
        <div className="grid grid-cols-6 gap-x-2 mt-2">
          <Card className="w-full p-4 col-span-3 flex flex-col">
            <h2 className="text-xl font-semibold">Assessment Performance</h2>
            <div className="items-center justify-center">
              <PerformanceGraph assessmentId={assessmentId} />
            </div>
            {results && results.length > 0 && (
              <p className="text-center">
                Total Responses: {results.length}
              </p>
            )}
          </Card>
          <Card className="w-full p-4 col-span-3">
            <h3 className="text-xl font-semibold">
              Most Challenging Questions
            </h3>
            <HardestQuestions assessmentId={assessmentId} />
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="analysis">
        <Card className="p-2 mt-2">
          <TeacherFeedback
            assessmentId={assessmentId}
            averageScore={averageScore}
            membersCount={membersCount}
            latestSubmissionId={latestSubmissionId!}
            submissionCount={submissionCount}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
