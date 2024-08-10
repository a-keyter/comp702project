"use client";


import { SafeClass } from "@/lib/classUtils/getClassDetails";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";

export const classColumns: ColumnDef<SafeClass>[] = [
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
        const thisClass = row.original;
        const truncatedTitle =
        thisClass.title.length > 40
          ? `${thisClass.title.substring(0, 40)}...`
          : thisClass.title;
        return (
          <Link href={`/classes/${thisClass.id}`}>
            <p title={thisClass.title} className="pl-4">{truncatedTitle}</p>
          </Link>
        );
      },
  },
  {
    accessorKey: "id",
    header: "Class Code",
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
      const thisClass = row.original
 
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(thisClass.id)}
            >
              Copy class ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
