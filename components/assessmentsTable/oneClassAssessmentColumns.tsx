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
import { Assessment } from "@prisma/client";
import DeleteAssessmentDialog from "../DeleteAssessmentDialog";
import { Badge } from "../ui/badge";

type AssessmentWithStats = Assessment & {
  submissionCount: number;
  averageScore: number | string;
  class: {
    id: string;
    title: string;
  };
};

export const oneClassAssessmentColumns: ColumnDef<AssessmentWithStats>[] = [
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
          <p title={thisAssessment.title} className="pl-4 hover:underline">{truncatedTitle}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "submissionCount",
    header: "Submissions",
  },
  {
    accessorKey: "averageScore",
    header: "Average Score",
    cell: ({row}) => {
      const average = row.original.averageScore
      return(<div>
        {typeof average === 'number' 
          ? average.toFixed(2) 
          : average}
      </div>
  )
    }
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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="w-full flex justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status
      return <div className="pl-4"><Badge>{status}</Badge></div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const thisAssessment = row.original;

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
            <Link href={`/assessments/${thisAssessment.id}`} >
              <DropdownMenuItem >Assessment Overview</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
