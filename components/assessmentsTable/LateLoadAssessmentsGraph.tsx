"use client";

import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getLiveClassAssessmentsTeacher } from "@/lib/assessmentUtils/getAssessmentDetails";
import { $Enums } from "@prisma/client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export type AssessmentWithStats = {
  id: string;
  title: string;
  objectives: string;
  status: $Enums.AssessmentStatus;
  classId: string;
  createdById: string;
  submissionCount: number;
  averageScore: string;
  submissions: undefined;
  class: {
    id: string;
    title: string;
  };
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
};

export default function LateLoadAssessmentsGraph({
    classId,
    classMemberCount,
  }: {
    classId: string;
    classMemberCount: number;
  }) {
    const [loading, setLoading] = useState(true);
    const [teacherAssessments, setTeacherAssessments] = useState<
      AssessmentWithStats[]
    >([]);
    const dataFetchedRef = useRef(false);
    const router = useRouter();
  
    useEffect(() => {
      async function fetchAssessments() {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        try {
          const assessments = await getLiveClassAssessmentsTeacher(classId);
          setTeacherAssessments(assessments || []);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching assessments:", error);
          setTeacherAssessments([]);
          setLoading(false);
        }
      }
  
      fetchAssessments();
    }, [classId]);
  
    // Sort assessments by due date
    const sortedAssessments = [...teacherAssessments].sort(
      (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
    );
  
    // Prepare data for the chart
    const chartData = sortedAssessments.map((assessment) => ({
      dueDate: assessment.dueDate,
      averageScore: parseFloat(assessment.averageScore),
      completionPercentage: (assessment.submissionCount / classMemberCount) * 100,
      title: assessment.title,
      id: assessment.id,
    }));
  
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const averageScore = isNaN(payload[0].value) ? 0 : payload[0].value;
        const completionRate = isNaN(payload[1].value) ? 0 : payload[1].value;
    
        return (
          <div className="custom-tooltip bg-white p-4 border border-gray-200 rounded shadow">
            <p className="label font-bold">{`${payload[0].payload.title}`}</p>
            <p className="date">{`Due date: ${new Date(label).toLocaleDateString()}`}</p>
            <p className="average-score">{`Average Score: ${averageScore.toFixed(2)}%`}</p>
            <p className="completion-rate">{`Completion Rate: ${completionRate.toFixed(2)}%`}</p>
          </div>
        );
      }
    
      return null;
    };
  
    const handleClick = (data: any) => {
      if (data && data.activePayload && data.activePayload.length) {
        const assessmentId = data.activePayload[0].payload.id;
        router.push(`/assessments/${assessmentId}`);
      }
    };
  
    if (loading) {
      return <Skeleton className="w-full h-64" />;
    }
  
    return (
        <Card className="w-full p-2">
        <CardHeader>
          <CardTitle>Assessment Metrics Over Time</CardTitle>
          <CardDescription>Average Scores and Completion Rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              onClick={handleClick}
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
                tick={{ fontSize: 12 }}
                allowDataOverflow={false}
                allowDecimals={false}
                allowDuplicatedCategory={true}
                hide={false}
                interval="preserveStartEnd"
                minTickGap={5}
                orientation="bottom"
                reversed={false}
                scale="auto"
                tickCount={5}
                type="category"
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                allowDataOverflow={false}
                allowDecimals={true}
                allowDuplicatedCategory={true}
                hide={false}
                orientation="left"
                reversed={false}
                scale="auto"
                tickCount={5}
                type="number"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="averageScore"
                name="Average Score"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="completionPercentage"
                name="Completion Rate"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
