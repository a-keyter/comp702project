import LateLoadTeacherAssessmentTable from "@/components/assessmentsTable/LateLoadTeacherAssessmentTable";
import LateLoadStudentsByClassTable from "@/components/studentsTable/LateLoadStudentsByClassTable";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeacherViewSelect({
  classId,
  classTitle,
}: {
  classId: string;
  classTitle: string;
}) {
  // console.log("TeacherViewSelect props:", { classId, classTitle });

  return (
    <Tabs defaultValue="assessments" className="w-full">
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="assessments" className="col-span-1">
          Assessments
        </TabsTrigger>
        <TabsTrigger value="students" className="col-span-1">
          Students
        </TabsTrigger>
        <TabsTrigger value="results" className="col-span-1">
          Performance
        </TabsTrigger>
      </TabsList>
      <TabsContent value="assessments">
        <Card className="w-full p-2">
          <LateLoadTeacherAssessmentTable
            classId={classId}
            classTitle={classTitle}
          />
        </Card>
      </TabsContent>
      <TabsContent value="students">
        <Card className="w-full p-2">
          <LateLoadStudentsByClassTable
            classId={classId}
            classTitle={classTitle}
          />
        </Card>
      </TabsContent>
      <TabsContent value="results">
        <Card className="w-full p-2">
          {/*  */}
          Assessment Graph goes here.
          {/*  */}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
