import ResultsDisplay from "@/components/assessmentAttempt/ResultsDisplay";
import { getAssessmentResults } from "@/lib/assessmentUtils/getAssessmentResults";

async function AssessmentResultsPage({ params }: { params: { id: string } }) {
  const results = await getAssessmentResults(params.id);

  return (
    <div className="w-full max-w-4xl">
      {!results && <div>no results found</div>}

      {results && (
        <ResultsDisplay
          assessmentTitle={results.assessmentTitle}
          classTitle={results.classTitle}
          score={results.score}
          totalQuestions={results.totalQuestions}
          correctAnswers={results.correctAnswers}
          responses={results.responses}
        />
      )}
    </div>
  );
}

export default AssessmentResultsPage;
