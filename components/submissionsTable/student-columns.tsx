// components/student-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResponseWithUser } from "./columns";


export const studentColumns: ColumnDef<ResponseWithUser>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          className="w-full flex justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submission Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const formatted = date.toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour12: false,
      });
      return <div className="pl-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          className="w-full flex justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const score = row.original.score;
      return <div className="pl-4">{score !== null ? `${score.toFixed(2)}%` : 'N/A'}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Link href={`/assessments/results/${row.original.id}`}>
          <Button variant="ghost">View Results</Button>
        </Link>
      );
    },
  },
];