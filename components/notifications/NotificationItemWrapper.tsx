import Link from "next/link";

import { NotificationType } from "@prisma/client";
import { Notification } from "@/app/(application)/(pageroutes)/notifications/page";
import RemoveNotificationButton from "./RemoveNotificationButton";



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
      <div className={`flex flex-1 gap-x-4 border-b-2 border-gray-300 items-center ${notification.is_unread === true ? "bg-blue-200" : "bg-white"}`}>
      <Link href={href} className="w-full">
        <div className={`w-full h-auto min-h-20 flex flex-col justify-center p-4`}>
          <span className="font-semibold">{content}</span>
          <span className="text-sm text-gray-500 mt-2">
            From: {notification.sender.name} •{" "}
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
      </Link>
      <RemoveNotificationButton notificationId={notification.id}/>
      </div>
    );
  }