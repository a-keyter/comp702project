import Link from "next/link";

import { Notification } from "./page";
import { NotificationType } from "@prisma/client";

export default function NotificationItemWrapper({
    notification,
  }: {
    notification: Notification;
  }) {
    let href = "/";
    let content = "";
  
    if (notification.issueId) {
      href = `/issues/${notification.issueId}`;
    } else if (notification.assessmentId && notification.assessment) {
      href = `/assessments/${notification.assessmentId}`;
    } else if (notification.classId && notification.class) {
      href = `/classes/${notification.classId}`;
    }
  
    switch (notification.type) {
      case NotificationType.NEW_ASSESSMENT:
        content = "New assessment available for " + notification.classId;
        break;
      case NotificationType.CLASS_JOIN_REQUEST:
        content = notification.sender.name + " has requested to join " + notification.classId + ": " + notification.class?.title;
        break;
      case NotificationType.CLASS_JOIN_ACCEPTED:
        content = "You have been added to " + notification.classId + ": " + notification.class?.title;
        break;
      case NotificationType.CLASS_JOIN_REJECTED:
        content = "You have been rejected from " + notification.classId + ": " + notification.class?.title;
        href = "#"
        break;
      case NotificationType.FEEDBACK_ISSUE_RAISED:
        content = "New feedback issue raised for the assessment " + notification.assessment?.title;
        break;
      case NotificationType.QUESTION_ISSUE_RAISED:
        content = "New question issue raised for the assessment " + notification.assessment?.title;
        break;
      case NotificationType.NEW_ISSUE_MESSAGE:
        content = "New message in an issue";
        break;
      default:
        content = "New notification";
    }
  
    return (
      <Link href={href}>
        <div className="bg-blue-200 w-full h-auto min-h-20 border-b-2 border-blue-300 flex flex-col justify-center p-4">
          <span className="font-semibold">{content}</span>
          <span className="text-sm text-gray-500 mt-2">
            From: {notification.sender.name} •{" "}
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
      </Link>
    );
  }