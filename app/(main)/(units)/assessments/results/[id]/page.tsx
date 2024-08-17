import ResultsDisplay from "@/components/assessmentAttempt/ResultsDisplay";
import { getSubmissionResults } from "@/lib/assessmentUtils/getSubmissionResults";

async function AssessmentResultsPage({ params }: { params: { id: string } }) {
  const results = await getSubmissionResults(params.id);

  return (
    <div className="w-full max-w-4xl">
      {!results && <div>no results found</div>}

      {results && (
        <ResultsDisplay
          submissionId={params.id}
          assessmentId={results.assessmentId}
          assessmentTitle={results.assessmentTitle}
          classTitle={results.classTitle}
          classId={results.classId}
          score={results.score}
          totalQuestions={results.totalQuestions}
          correctAnswers={results.correctAnswers}
          responses={results.responses}
          submitterName={results.submitterName}
          feedback={results.feedback}
        />
      )}
    </div>
  );
}

export default AssessmentResultsPage;
