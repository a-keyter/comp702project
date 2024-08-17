"use client";
import React, { useState, useEffect } from "react";
import { ClassJoinRequestsDataTable } from "./data-table";
import { ClassJoinRequest, classJoinRequestColumns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJoinRequests } from "@/lib/issueUtils/fetchJoinRequests";
import { Input } from "@/components/ui/input";

export default function JoinRequestsPage() {
  const [joinRequests, setJoinRequests] = useState<ClassJoinRequest[]>([]);

  useEffect(() => {
    const loadJoinRequests = async () => {
      const requests = await fetchJoinRequests();
      if (requests) {
        setJoinRequests(requests);
      }
    };
    loadJoinRequests();
  }, []);

  const updateJoinRequests = (issueId: string) => {
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.issueId !== issueId)
    );
  };

  return (
    <ClassJoinRequestsDataTable
      columns={classJoinRequestColumns}
      data={joinRequests}
      updateJoinRequests={updateJoinRequests}
    />
  );
}
