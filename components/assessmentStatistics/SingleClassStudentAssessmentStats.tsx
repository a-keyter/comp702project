"use client";

import React, { useState, useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAssessmentsByNicknameAndClass } from "@/lib/analysisUtils/getAssessmentsByNicknameAndClass";
import { Skeleton } from "../ui/skeleton";

type AssessmentData = {
  assessmentId: string;
  assessmentTitle: string;
  latestScore: number;
  submissionDate: string | null;
  dueDate: Date;
  status: string;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const formatDate = (date: Date) => {
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: false,
      });
    };

    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow">
        <p className="font-bold">
          {data.assessmentTitle}
        </p>
        <p>Latest Score: {data.latestScore.toFixed(2)}</p>
        <p>Due Date: {formatDate(new Date(data.dueDate))}</p>
        <p>
          {data.submissionDate
            ? `Submitted: ${formatDate(data.submissionDate)}`
            : "Status: Not Submitted"}
        </p>
      </div>
    );
  }
  return null;
};

export default function SingleClassStudentAssessmentStats({
  studentNickname,
  classId,
}: {
  studentNickname: string;
  classId: string;
}) {
  const [assessmentData, setAssessmentData] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!classId) return;

      setLoading(true);
      try {
        const data = await getAssessmentsByNicknameAndClass(
          studentNickname,
          classId
        );
        setAssessmentData(data);
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [studentNickname, classId]);

  if (loading) return <Skeleton className="w-full h-80" />;

  return (
    <div className="w-full p-2">
      <CardHeader>
        <CardTitle className="mb-2">Assessment Scores Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-full" />
        ) : assessmentData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={assessmentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dueDate"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                padding={{ left: 30, right: 30 }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="latestScore"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No assessment data available for this class</p>
        )}
      </CardContent>
    </div>
  );
}
