"use server"

import { QuestionFeedbackIssue } from "@/components/issuesTable/columns";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

async function fetchOpenStudentQuestionFeedbackIssues(): Promise<QuestionFeedbackIssue[] | null> {
    const { userId } = auth();
  
    if (!userId) {
      return null;
    }
  
    try {
      const issues = await prisma.issue.findMany({
        where: {
          type: {
            in: ['QUESTION_ISSUE', 'FEEDBACK_ISSUE']
          },
          status: {
            in: ['UNREAD', 'OPEN']
          },
          raisedBy: {
            id: userId
          }
        },
        include: {
          relevantClass: {
            select: {
              id: true,
              title: true,
            }
          },
          relevantAssessment: {
            select: {
              id: true,
              title: true,
            }
          },
          raisedBy: {
            select: {
              id: true,
              name: true,
            }
          },
          lastUpdatedBy: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });
  
      return issues.map(issue => ({
        id: issue.id,
        assessmentTitle: issue.relevantAssessment?.title || 'N/A',
        assessmentId: issue.relevantAssessment?.id || '',
        classId: issue.relevantClass?.id || '',
        classTitle: issue.relevantClass?.title || '',
        issueType: issue.type === 'QUESTION_ISSUE' ? 'Question' : 'Feedback',
        createdBy: {
          name: "You",
          id: issue.raisedBy.id,
        },
        lastUpdatedBy: {
          name: issue.lastUpdatedBy.id === userId ? "You" : issue.lastUpdatedBy.name,
          id: issue.lastUpdatedBy.id,
        },
        lastUpdated: issue.updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching open student question/feedback issues:", error);
      return null;
    }
  }
  
  export { fetchOpenStudentQuestionFeedbackIssues };