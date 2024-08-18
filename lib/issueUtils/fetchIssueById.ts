"use server"

import { prisma } from "../initPrisma";

type Issue = {
  id: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  raisedBy: {
    id: string;
    name: string;
  };
  lastUpdatedBy: {
    id: string;
    name: string;
  };
  relevantClass: {
    id: string;
    title: string;
  };
  relevantAssessment?: {
    id: string;
    title: string;
  } | null;
  question?: string | null;
  givenAnswer?: string | null;
  correctAnswer?: string | null;
  feedback?: string | null;
  };

async function fetchIssueById(issueId: string): Promise<Issue | null> {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        raisedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        lastUpdatedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        relevantClass: {
          select: {
            id: true,
            title: true,
          },
        },
        relevantAssessment: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!issue) {
      return null;
    }

    return {
      id: issue.id,
      type: issue.type,
      status: issue.status,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      raisedBy: issue.raisedBy,
      lastUpdatedBy: issue.lastUpdatedBy,
      relevantClass: issue.relevantClass,
      relevantAssessment: issue.relevantAssessment,
      question: issue.question,
      givenAnswer: issue.givenAnswer,
      correctAnswer: issue.correctAnswer,
      feedback: issue.feedback,
    };
  } catch (error) {
    console.error("Error fetching issue with messages:", error);
    return null;
  }
}

export { fetchIssueById };