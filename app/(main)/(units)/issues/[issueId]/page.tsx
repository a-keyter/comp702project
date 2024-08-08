async function fetchIssueData(issueId:string) {
    return {
        issueId: issueId,
        status: "Unopened / Under Review / Closed",
        issueType: "Question", // Could also be Feedback
        issueItemId: "ashdaiosjdwidapj" // This is either the AssessmentItem ID or the ResponseId
    }
}

// This function will return the array of all messages in the issue thread.
// The first message will inevitably be from a student, since they are the person who raises the issue.
async function fetchIssueMessages(issueId:string) {
    return [{
        issueId: issueId,
        messageId: "someMessageId",
        sentBy: "someUserId", // The person who sent the message
        sentDate: "someArbitraryDate", // The date / time the message was sent
        messageContent: "Message will say some arbitrary thing about the", // The contents of the meesage
        senderRole: "Student" // This is either the AssessmentItem ID or the ResponseId
    }]
}

export default async function IssuePage({ params }: { params: { issueId: string } }) {
    const issueData = fetchIssueData(params.issueId)

    return (
        <div>This is where the user will be able to see individual issueData</div>
    )
}