"use client"

import { Button } from "@/components/ui/button"
import { deleteNotificationById } from "@/lib/notificationUtils/deleteNotificationById"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface RemoveNotificationButtonProps {
  notificationId: string
}

function RemoveNotificationButton({ notificationId }: RemoveNotificationButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const result = await deleteNotificationById(notificationId)
      if (result.success) {
        router.refresh()
      } else {
        console.error("Failed to delete notification:", result.error)
      }
    } catch (error) {
      console.error("An error occurred while deleting the notification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="destructive" 
      onClick={handleClick} 
      disabled={isLoading}
      className="px-2 mr-4"
    >
      <X />
    </Button>
  )
}

export default RemoveNotificationButton