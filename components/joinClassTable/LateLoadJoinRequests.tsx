"use client";
import React, { useState, useEffect } from "react";
import { ClassJoinRequestsDataTable } from "./data-table";
import { ClassJoinRequest, classJoinRequestColumns } from "./columns";
import { fetchJoinRequests } from "@/lib/issueUtils/fetchJoinRequests";
import { Skeleton } from "../ui/skeleton";

export default function LateLoadJoinRequests() {
  const [joinRequests, setJoinRequests] = useState<ClassJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJoinRequests = async () => {
      try {
        setLoading(true);
        const requests = await fetchJoinRequests();
        if (requests) {
          setJoinRequests(requests);
        } else {
          throw new Error('Failed to fetch join requests');
        }
      } catch (error) {
        console.error("Error fetching join requests:", error);
        setError("Failed to load join requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadJoinRequests();
  }, []);

  const updateJoinRequests = (issueId: string) => {
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.issueId !== issueId)
    );
  };

  if (loading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <ClassJoinRequestsDataTable
      columns={classJoinRequestColumns}
      data={joinRequests}
      updateJoinRequests={updateJoinRequests}
    />
  );
}