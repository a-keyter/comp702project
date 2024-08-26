import { Card } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SingleClassStudentAssessmentStats from "@/components/assessmentStatistics/SingleClassStudentAssessmentStats";
import LateLoadStudentAssessmentTable from "@/components/assessmentsTable/LateLoadStudentAssessmentTable";

export default function StudentViewSelect({
  studentNickname,
  classId,
  classTitle,
}: {
  studentNickname: string;
  classId: string;
  classTitle: string;
}) {
  // console.log("StudentViewSelect props:", {
  //   studentNickname,
  //   classId,
  //   classTitle,
  // });

  return (
    <Tabs defaultValue="assessments" className="w-full">
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="assessments" className="col-span-1">
          Assessments
        </TabsTrigger>
        <TabsTrigger value="results" className="col-span-1">
          Performance
        </TabsTrigger>
      </TabsList>
      <TabsContent value="assessments">
        <Card className="w-full p-2">
          <LateLoadStudentAssessmentTable
            classId={classId}
            classTitle={classTitle}
          />
        </Card>
      </TabsContent>
      <TabsContent value="results">
        <Card className="w-full p-2">
          <SingleClassStudentAssessmentStats
            studentNickname={studentNickname}
            classId={classId}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
