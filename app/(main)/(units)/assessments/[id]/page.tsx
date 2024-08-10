import DeleteAssessmentDialog from "@/components/DeleteAssessmentDialog";
import ReportIssueDialog from "@/components/ReportIssueDialog";
import { responseColumns } from "@/components/submissionsTable/columns";
import { AllResponsesDataTable } from "@/components/submissionsTable/data-table";
import { studentColumns } from "@/components/submissionsTable/student-columns";
import { StudentDataTable } from "@/components/submissionsTable/student-data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchSubmissionsAndQuestionStats } from "@/lib/analysisUtils/assessmentPerformance";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { getResultsByAssessmentId } from "@/lib/assessmentUtils/getAssessmentSubmissions";
import { getStudentResultsByAssessmentId } from "@/lib/assessmentUtils/getStudentResultsByAssessmentId";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function AssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);
  const { questionStats } = await fetchSubmissionsAndQuestionStats(params.id);

  if (!assessmentData) {
    notFound();
  }

  const user = await getUserDetails();

  if (!user) {
    return redirect("/onboard");
  }

  const results =
    user.role === "TEACHER"
      ? await getResultsByAssessmentId(params.id)
      : await getStudentResultsByAssessmentId(params.id);

  const submissionCount = results ? results.length : 0;
  let averageScore = 0;

  if (results && submissionCount > 0) {
    const scores = results.map((submission) => submission.score || 0);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    averageScore = totalScore / submissionCount;
  }

  return (
    <div className="w-full max-w-4xl py-1">
      <div className="flex justify-between items-center ">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold w-[25rem]">
            {assessmentData.title}
          </h2>
          <p>
            Class:{" "}
            <Link href={`/classes/${assessmentData.class.id}`}>
              {assessmentData.class.id.toUpperCase()} -{" "}
              {assessmentData.class.title}
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          {user.role === "TEACHER" && (
            <div className="flex space-x-4 justify-end">
              <Link href={`/assessments/preview/${assessmentData.id}`}>
                <Button>Preview</Button>
              </Link>
              <Link href={`/assessments/edit/${assessmentData.id}`}>
                <Button className="bg-yellow-300 text-black hover:text-white">
                  Edit
                </Button>
              </Link>
              <DeleteAssessmentDialog
                className=""
                content="Delete"
                classId={assessmentData.classId}
                assessmentId={assessmentData.id}
                assessmentTitle={assessmentData.title}
              />
            </div>
          )}
          {user.role === "STUDENT" && (
            <div className="flex space-x-4 justify-end">
              <Link href={`/assessments/attempt/${assessmentData.id}`}>
                <Button>New Attempt</Button>
              </Link>
            </div>
          )}
          <p className="text-right">
            <strong>Last Updated:</strong>{" "}
            {new Date(assessmentData.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-x-2 my-2">
        <Card className="col-span-4 p-2 px-2">
          <h3 className="font-semibold text-md">Assessment Objectives</h3>
          <p>{assessmentData.objectives}</p>
        </Card>
        <Card className="col-span-1 p-2">
          <h3>Submissions</h3>
          <p className="font-bold text-2xl">{submissionCount}</p>
        </Card>
        {user.role === "TEACHER" ? (
          <Card className="col-span-1 p-2">
            <h3>Average Score</h3>
            <p className="font-bold text-2xl">{averageScore.toFixed(2)}%</p>
          </Card>
        ) : (
          <Card className="col-span-1 p-2">
            <h3>Latest Score</h3>
            <p className="font-bold text-2xl">
              {results && results.length > 0 ? results[0].score + "%" : "N/A"}
            </p>
          </Card>
        )}
      </div>

      {results && (
        <div className="w-full mt-2">
          {user.role === "TEACHER" ? (
            <AllResponsesDataTable
              columns={responseColumns}
              data={results}
              assessmentTitle={assessmentData.title}
            />
          ) : (
            <StudentDataTable
              columns={studentColumns}
              data={results}
              assessmentTitle={assessmentData.title}
            />
          )}
        </div>
      )}

      {results && user.role === "STUDENT" ? (
        <Card className="p-2 mt-2">
          <div className="flex justify-between items-end py-2 mb-2 border-b-2">
            <h3 className="font-bold text-xl ">Feedback</h3>
            {results.length > 0 && (
              <ReportIssueDialog
                issueItemId={results[0].id}
                issueType="Feedback"
                issueObject={results[0].feedback}
              />
            )}
          </div>
          <p>
            {results.length > 0
              ? results[0].feedback
              : "No Feedback Available."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-6 gap-x-2 mt-2">
          <div className="w-full h-32 p-2 col-span-3">
            Placeholder AI Feedback
          </div>
          <Card className="col-span-3 p-2">Most Challenging Questions</Card>
        </div>
      )}
    </div>
  );
}

export default AssessmentPage;
