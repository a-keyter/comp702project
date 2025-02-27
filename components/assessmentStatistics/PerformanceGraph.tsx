"use client";

import {
  fetchQuestionStats,
  QuestionStatistics,
} from "@/lib/analysisUtils/assessmentStats";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "../ui/skeleton";

function PerformanceGraph({ assessmentId }: { assessmentId: string }) {
  const [data, setData] = useState<QuestionStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchQuestionStats(assessmentId);
        setData(result.questionStats);
      } catch (error) {
        console.error("Error fetching question stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  if (isLoading) {
    return <Skeleton className="h-[300px]" />;
  }

  if (!isLoading && data.length === 0) {
    return <div>No Results Available.</div>;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const question = data.find(
        (item) => item.questionNumber === label
      )?.question;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded">
          <p className="label mb-2">{`${label}: ${question}`}</p>
          <p className="correct">{`Correct Responses: ${payload[0].value}`}</p>
          <p className="incorrect">{`Incorrect Responses: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>

      <BarChart
        data={data}
        margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="questionNumber"
          interval={0}
          type="category"
          tick={{ fontSize: 12 }}
        />{" "}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          name={"Correct Responses"}
          dataKey="correctResponses"
          stackId="a"
          fill="#82ca9d"
        />
        <Bar
          name={"Incorrect Responses"}
          dataKey="incorrectResponses"
          stackId="a"
          fill="#f69697"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default PerformanceGraph;
