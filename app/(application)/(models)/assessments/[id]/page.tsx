import DeleteAssessmentDialog from "@/components/assessmentDialogs/DeleteAssessmentDialog";

import { studentColumns } from "@/components/submissionsTable/student-columns";
import { StudentDataTable } from "@/components/submissionsTable/student-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UpdateAssessmentDetailsDialog } from "@/components/assessmentDialogs/UpdateAssessmentDetailsDialog";
import { getAssessmentById } from "@/lib/assessmentUtils/getAssessmentDetails";
import { getResultsByAssessmentId } from "@/lib/assessmentUtils/getAssessmentSubmissions";
import { getStudentResultsByAssessmentId } from "@/lib/assessmentUtils/getStudentResultsByAssessmentId";
import { getUserDetails } from "@/lib/userUtils/getUserDetails";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AssessmentViewSelect } from "@/components/assessmentStatistics/AssessmentViewSelect";
import ReportIssueDialog from "@/components/issuesDialog/ReportIssueDialog";

async function AssessmentPage({ params }: { params: { id: string } }) {
  const assessmentData = await getAssessmentById(params.id);

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
      <Card className="flex justify-between items-center w-full p-2">
        <div className="flex">
          <div>
            <h2 className="text-2xl font-bold max-w-[25rem]">
              {assessmentData.title}
            </h2>
            <p>
              <strong>Class: </strong>
              <Link href={`/classes/${assessmentData.class.id}`}>
                {assessmentData.class.id.toUpperCase()} -{" "}
                {assessmentData.class.title}
              </Link>
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(assessmentData.dueDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
          {user.role === "TEACHER" && (
            <UpdateAssessmentDetailsDialog
              assessmentId={assessmentData.id}
              currentDueDate={assessmentData.dueDate}
              currentObjectives={assessmentData.objectives}
              currentTitle={assessmentData.title}
              icon={true}
            />
          )}
        </div>
        <div className="flex flex-col justify-between">
          {user.role === "TEACHER" && assessmentData.status === "DRAFT" && (
            <div className="flex space-x-4 justify-end">
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
              <Badge>{assessmentData.status}</Badge>
            </div>
          )}
          {user.role === "TEACHER" && assessmentData.status === "LIVE" && (
            <div className="flex space-x-4 justify-end">
              <Link href={`/assessments/preview/${assessmentData.id}`}>
                <Button>View</Button>
              </Link>
              <DeleteAssessmentDialog
                className=""
                content="Delete"
                classId={assessmentData.classId}
                assessmentId={assessmentData.id}
                assessmentTitle={assessmentData.title}
              />
              <Badge>{assessmentData.status}</Badge>
            </div>
          )}
          {user.role === "STUDENT" && (
            <div className="flex space-x-4 justify-end">
              <Link href={`/assessments/attempt/${assessmentData.id}`}>
                <Button>New Attempt</Button>
              </Link>
            </div>
          )}
          <p className="text-right mt-3">
            <strong>Last Updated:</strong>{" "}
            {new Date(assessmentData.updatedAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
      </Card>
      <div className="grid grid-cols-6 gap-x-2 my-2">
        <Card className="col-span-4 p-2 px-2">
          <h3 className="font-semibold text-md">Assessment Objectives</h3>
          <p>{assessmentData.objectives}</p>
        </Card>
        <Card className="col-span-1 p-2">
          <h3>Submissions</h3>
          <p className="font-bold text-2xl">
            {submissionCount}{" "}
            {user.role === "TEACHER" &&
              `/ ${assessmentData.class._count.members}`}
          </p>
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
              {results && results.length > 0
                ? results[0].score?.toFixed(2) + "%"
                : "N/A"}
            </p>
          </Card>
        )}
      </div>

      {results && user.role === "TEACHER" && (
        <AssessmentViewSelect
          results={results}
          assessmentId={assessmentData.id}
          averageScore={averageScore}
          latestSubmissionId={assessmentData.submissions[0]?.id || null}
          membersCount={assessmentData.class._count.members}
          submissionCount={submissionCount}
        />
      )}

      {results && user.role === "STUDENT" && (
        <div className="flex flex-col gap-y-4">
          <div className="w-full">
            <StudentDataTable
              columns={studentColumns}
              data={results}
            />
          </div>
          <Card className="p-2">
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
            {results.length > 0 && (
              <p className="text-sm text-center pt-1 mt-1 border-t-2">
                AI Generated Feedback may not be 100% accurate.
              </p>
            )}
          </Card>
          <div data-id="assess-page-loaded" style={{ display: "none" }}></div>
        </div>
      )}
    </div>
  );
}

export default AssessmentPage;
