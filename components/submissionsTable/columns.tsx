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

export type ResponseWithUser = {
  id: string;
  createdAt: Date;
  score: number | null;
  feedback: string | null;
  user: {
    name: string;
    nickname: string;
  };
  attemptCount: number;
};

export const responseColumns: ColumnDef<ResponseWithUser>[] = [
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          className="w-full flex justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const userNickname = row.original.user.nickname;
      return (
        <div className="flex items-center space-x-2">
          <Link href={`/students/${userNickname}`} className="pl-4">
            {row.original.user.name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "attemptCount",
    header: ({ column }) => {
      return (
        <Button
          className="w-full flex justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Attempts
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.attemptCount}</div>;
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
          Best Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const score = row.original.score;
      return (
        <div className="pl-4">
          {score !== null ? `${score.toFixed(2)}%` : "N/A"}
        </div>
      );
    },
  },
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
    id: "actions",
    cell: ({ row }) => {
      const submission = row.original;
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
            <DropdownMenuItem>
              <Link href={`/assessments/results/${submission.id}/`}>
                View Results
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];