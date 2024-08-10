"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { Assessment } from "@prisma/client";
 

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
        )
      },
    cell: ({ row }) => {
        const thisAssessment = row.original;
        return (
          <Link href={`/assessments/${thisAssessment.id}`}>
            <p className="pl-4">{thisAssessment.title}</p>
          </Link>
        );
      },
  },
    {
    accessorKey: "submissionCount",
    header: "Submissions"
  },
  {
    accessorKey: "averageScore",
    header: "Average Score"
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
        return (
          <Button
          className="w-full flex justify-start"

            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      const formatted = date
        .toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour12: false,
        })
      return <div className="pl-4">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const thisAssessment = row.original
 
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
            <Link href={`/assessments/${thisAssessment.id}`}>
            <DropdownMenuItem>Assessment Overview</DropdownMenuItem>
            </Link>
            <Link href={`/assessments/edit/${thisAssessment.id}`}>
            <DropdownMenuItem>Edit Assessment</DropdownMenuItem>
            </Link>
            <Link href={`/assessments/preview/${thisAssessment.id}`}>
            <DropdownMenuItem>Preview Assessment</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
