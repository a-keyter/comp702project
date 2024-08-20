"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserNotificationCount } from "@/lib/notificationUtils/getNotificationCount";
import { clearUnreadNotifications } from "@/lib/notificationUtils/clearNotifications";
import Link from "next/link";

function NotificationsButton() {
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchNotificationCount = async () => {
      const count = await getUserNotificationCount();
      setNotificationCount(count);
    };

    // Fetch immediately when component mounts
    fetchNotificationCount();

    // Set up an interval to fetch every 60 seconds
    // const intervalId = setInterval(fetchNotificationCount, 10000);

    // Clean up the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, []);

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default link behavior

    setNotificationCount(0);

    // Navigate to the notifications page
    router.push("/notifications");
  };

  return (
    <Link href="/notifications">
    <Button
      variant="ghost"
      className="flex flex-col px-2"
      onClick={handleClick}
    >
      <div className="flex">
        <Bell />
        {notificationCount > 0 && (
          <div
            className={`rounded-full text-sm bg-orange-400 py-[0.1rem] ${
              notificationCount === 1
                ? "px-2"
                : notificationCount < 10
                ? "px-1"
                : "p-[0.1rem]"
            }`}
          >
            {notificationCount}
          </div>
        )}
      </div>
      Updates
    </Button>
    </Link>
  );
}

export default NotificationsButton;
