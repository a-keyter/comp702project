import { Card } from "@/components/ui/card";
import { getUserNotifications } from "@/lib/notificationUtils/getUserNotifications";
import Link from "next/link";
import { NotificationType } from "@prisma/client";
import NotificationItemWrapper from "./NotificationItemWrapper";

// Define the shape of a Notification
export interface Notification {
  id: string;
  type: NotificationType;
  recipientId: string;
  senderId: string;
  classId: string | null;
  assessmentId: string | null;
  issueId: string | null;
  is_unread: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    name: string;
  };
  issue: {
    id: string;
    type: string;
  } | null;
  assessment: {
    id: string;
    title: string;
  } | null;
  class: {
    id: string;
    title: string;
  } | null;
}

async function NotificationsPage() {
  const { success, notifications, error } = await getUserNotifications();

  if (!success || !notifications || notifications.length === 0) {
    return (
      <Card className="flex-1 w-full max-w-4xl">
        <div className="flex flex-col overflow-y-auto">
          <div className="bg-blue-200 w-full h-20 border-b-2 border-blue-300 flex items-center justify-center">
            {error || "No Notifications."}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 w-full max-w-4xl">
      <div className="flex flex-col overflow-y-auto">
        {notifications.map((notification: Notification) => (
          <NotificationItemWrapper
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </Card>
  );
}



export default NotificationsPage;
