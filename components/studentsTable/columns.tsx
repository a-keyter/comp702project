"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RemoveStudentButton from "./RemoveStudentButton";

// This type is used to define the shape of our data.
export type Student = {
  name: string; // Students name
  nickname: string; // Students nickname
  classId: string; // Current Class (for removals)
  assessmentsCompleted: string; // "X out of X"
  averageGrade: number; // Average grade across all assessments for which their is a submission
};

export const classStudentsColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original;
      return (
        <Link
          href={`/students/${value.nickname}`}
          className="pl-4 hover:underline"
        >
          {value.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "assessmentsCompleted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assessments Completed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.assessmentsCompleted;
      return <div className="pl-4">{value}</div>;
    },
  },
  {
    accessorKey: "averageGrade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Average Grade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.averageGrade;
      return <div className="pl-4">{value}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/students/${student.nickname}`}>
                <DropdownMenuItem>View Profile</DropdownMenuItem>
              </Link>
              <DialogTrigger asChild>
                <DropdownMenuItem>Remove from Class</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to remove{" "}
                {student.name} from this class ({student.classId})?? All
                submission data will be deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-x-4 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <RemoveStudentButton
                studentNickname={student.nickname}
                classId={student.classId}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
