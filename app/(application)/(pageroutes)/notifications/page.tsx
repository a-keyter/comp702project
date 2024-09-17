"use client"

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { getUserNotifications } from "@/lib/notificationUtils/getUserNotifications";
import { clearUnreadNotifications } from "@/lib/notificationUtils/clearNotifications";
import { NotificationType } from "@prisma/client";
import NotificationItemWrapper from "../../../../components/notifications/NotificationItemWrapper";
import LoadingSpinner from '@/components/LoadingSpinner';

// Updated Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  classId: string | null;
  assessmentId: string | null;
  issueId: string | null;
  is_unread: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: {
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

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { success, notifications: fetchedNotifications, error: fetchError } = await getUserNotifications();
        
        if (success && fetchedNotifications) {
          setNotifications(fetchedNotifications);
          await clearUnreadNotifications();
        } else {
          setError(fetchError || "Failed to fetch notifications");
        }
      } catch (err) {
        setError("An error occurred while fetching notifications");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  if (isLoading) {
    return (
      <Card className="flex-1 w-full max-w-4xl">
        <div className="flex flex-col overflow-y-auto">
          <div className="bg-blue-100 w-full h-20 border-b-2 border-gray-600 flex items-center justify-center">
            Loading... <div className='pl-3'><LoadingSpinner/></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error || notifications.length === 0) {
    return (
      <Card className="flex-1 w-full max-w-4xl">
        <div className="flex flex-col overflow-y-auto">
          <div className="bg-blue-100 w-full h-20 border-b-2 border-gray-600 flex items-center justify-center">
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