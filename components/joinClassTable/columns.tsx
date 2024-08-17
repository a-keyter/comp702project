"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ban, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { addUserToClass } from "@/lib/issueUtils/addUserToClass";
import { toast } from "../ui/use-toast";
import { rejectJoinRequest } from "@/lib/issueUtils/rejectJoinRequest";

// This type is used to define the shape of our data.
export type ClassJoinRequest = {
  issueId: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  classId: string;
  classTitle: string;
  createdAt: Date;
};

export const classJoinRequestColumns: ColumnDef<ClassJoinRequest>[] = [
    {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-4">{row.original.user.name}</div>,
  },
  {
    accessorKey: "user.role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original.user
      const role = user?.role.charAt(0).toUpperCase() + user?.role.slice(1).toLowerCase()
      return <div className="pl-4">{role}</div>;
    },
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.user.email;
      return <div className="pl-4">{value}</div>;
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
    cell: ({ row }) => {
      const value = row.original;
      return (
        <Link
          title={value.classTitle}
          href={`/classes/${value.classId}`}
          className="pl-4"
        >
          {value.classId}
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted Date
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
];
