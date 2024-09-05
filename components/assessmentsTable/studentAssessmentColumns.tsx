"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Assessment, Submission } from "@prisma/client";

type AssessmentWithAttempts = Assessment & {
  attempts: number;
  submissions: Pick<Submission, "id" | "score" | "createdAt">[];
  class: {
    id: string;
    title: string;
  };
};


export const studentAssessmentColumns: ColumnDef<AssessmentWithAttempts>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          className="w-full flex justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const thisAssessment = row.original;
      const truncatedTitle =
        thisAssessment.title.length > 30
          ? `${thisAssessment.title.substring(0, 30)}...`
          : thisAssessment.title;
      return (
        <Link href={`/assessments/${thisAssessment.id}`}>
          <p title={thisAssessment.title} className="pl-4">{truncatedTitle}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "class.title",
    header: ({ column }) => {
      return (
        <Button
          className="w-full flex justify-start "
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Class
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const classTitle = row.original.class.title
        
      return (
        <Link title={classTitle} href={`/classes/${row.original.class.id}`} className="pl-4">
          {row.original.class.id}
        </Link>
      );
    },
  },
  {
    accessorKey: "attempts",
    header: "Attempts",
  },
  {
    accessorKey: "submissions.0.score",
    header: "Latest Score",
    cell: ({ row }) => {
      const latestSubmission = row.original.submissions[0];
      const latestScore = latestSubmission ? (latestSubmission.score?.toFixed(2) + "%" ?? "Not graded") : "Not attempted";
      return <div className="">{latestScore}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          className="w-full flex justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      const formatted = date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour12: false,
      });
      return <div className="pl-4">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const thisAssessment = row.original;
      const latestSubmission = thisAssessment.submissions[0];
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {latestSubmission && (
              <Link href={`/assessments/results/${latestSubmission.id}`}>
                <DropdownMenuItem>See Latest Result</DropdownMenuItem>
              </Link>
            )}
            <Link href={`/assessments/attempt/${thisAssessment.id}`}>
              <DropdownMenuItem>Make a New Attempt</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
