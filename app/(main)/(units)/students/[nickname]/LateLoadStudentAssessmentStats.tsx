"use client"

import React, { useState, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAssessmentsByNicknameAndClass } from "@/lib/analysisUtils/getAssessmentsByNicknameAndClass";
import { Skeleton } from "@/components/ui/skeleton";


type Classes = {
  title: string;
  classId: string;
};

type AssessmentData = {
  assessmentId: string;
  assessmentTitle: string;
  latestScore: number;
  xAxisLabel: string;
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
        <p className="font-bold">{data.xAxisLabel.split(' - ')[0]} - {data.assessmentTitle}</p>
        <p>Latest Score: {data.latestScore.toFixed(2)}</p>
        <p>Due Date: {formatDate(new Date(data.dueDate))}</p>
        <p>Status: 
          {data.submissionDate
            ? ` Submitted on ${formatDate(new Date(data.submissionDate))}`
            : " Not Submitted"}
        </p>
      </div>
    );
  }
  return null;
};

export default function LateLoadStudentAssessmentStats({
  classes,
  studentNickname,
  studentName,
}: {
  classes: Classes[];
  studentNickname: string;
  studentName: string;
}) {
  const [classFocusId, setClassFocusId] = useState<string>("");
  const [assessmentData, setAssessmentData] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!classFocusId) return;
      
      setLoading(true);
      try {
        const data = await getAssessmentsByNicknameAndClass(studentNickname, classFocusId);
        setAssessmentData(data);
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [studentNickname, classFocusId]);

  return (
    <div className="grid grid-cols-6 gap-4 w-full">

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="mb-2">Assessment Scores Over Time</CardTitle>
          <Select onValueChange={setClassFocusId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select a class to view ${studentName}'s performance...`} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.classId} value={c.classId}>
                {c.classId.toUpperCase()} - {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </CardHeader>
        {classFocusId !== "" && (
        <CardContent>
          { loading ? (
            <Skeleton className="h-full"/>
          ) : assessmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={assessmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="xAxisLabel" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="latestScore" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No assessment data available for this student</p>
          )}
        </CardContent>
        )}
      </Card>
    </div>
  );
}

// 