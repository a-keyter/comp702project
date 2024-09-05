"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuestionFeedbackIssue } from "./columns";

export const studentQuestionFeedbackIssueColumns: ColumnDef<QuestionFeedbackIssue>[] =
  [
    {
      accessorKey: "issueType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Issue Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link href={`/issues/${row.original.id}`} className="pl-4 w-full">
          {row.original.issueType}
        </Link>
      ),
    },
    {
      accessorKey: "lastUpdatedBy.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated By
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original.lastUpdatedBy.name;
        const truncatedName =
          name.length > 20 ? `${name.substring(0, 20)}...` : name;
        return (
          <div title={name} className="pl-4">
            {truncatedName}
          </div>
        );
      },
    },
    {
      accessorKey: "classId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Class
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link
          href={`/classes/${row.original.classId}`}
          className="pl-4 hover:underline"
          title={row.original.classTitle}
        >
          {row.original.classId}
        </Link>
      ),
    },
    {
      accessorKey: "assessmentTitle",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Assessment Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const title = row.original.assessmentTitle;
        const truncatedTitle =
          title.length > 20 ? `${title.substring(0, 20)}...` : title;
        return (
          <Link
            href={`/assessments/${row.original.assessmentId}`}
            className="pl-4 hover:underline"
            title={title}
          >
            {truncatedTitle}
          </Link>
        );
      },
    },

    {
      accessorKey: "lastUpdated",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.lastUpdated);
        const formatted = date.toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour12: false,
        });
        return (
          <Link href={`/issues/${row.original.id}`} className="pl-4">
            {formatted}
          </Link>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
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
              <Link href={`/issues/${row.original.id}`}>
                <DropdownMenuItem>Manage Issue</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
