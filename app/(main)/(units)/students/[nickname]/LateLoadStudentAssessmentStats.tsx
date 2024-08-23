"use client"

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  submissionDate: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow">
        <p className="font-bold">{data.assessmentTitle}</p>
        <p>Latest Score: {data.latestScore.toFixed(2)}</p>
        <p>Date: {new Date(data.submissionDate).toLocaleDateString()}</p>
        <p>Status: {data.status}</p>
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

  const getAverageScore = () => {
    if (assessmentData.length === 0) return 0;
    const sum = assessmentData.reduce((acc, curr) => acc + curr.latestScore, 0);
    return (sum / assessmentData.length).toFixed(2);
  };

  const getTrendPercentage = () => {
    if (assessmentData.length < 2) return 0;
    const firstScore = assessmentData[0].latestScore;
    const lastScore = assessmentData[assessmentData.length - 1].latestScore;
    return (((lastScore - firstScore) / firstScore) * 100).toFixed(1);
  };

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
          <>
        <CardContent>
          { loading ? (
            <Skeleton className="h-full"/>
          ) : assessmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={assessmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="xAxisLabel" />
                <YAxis domain={[0, 100]} /> {/* Assuming scores are out of 100 */}
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="latestScore" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No assessment data available for this class</p>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending {Number(getTrendPercentage()) >= 0 ? "up" : "down"} by {Math.abs(Number(getTrendPercentage()))}% 
            <TrendingUp className={`h-4 w-4 ${Number(getTrendPercentage()) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <div className="leading-none text-muted-foreground">
            Average score: {getAverageScore()}
          </div>
        </CardFooter></>)}
      </Card>
    </div>
  );
}

// 