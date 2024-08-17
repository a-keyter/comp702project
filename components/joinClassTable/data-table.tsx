"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClassJoinRequest } from "./columns";
import { addUserToClass } from "@/lib/issueUtils/addUserToClass";
import { toast } from "../ui/use-toast";
import { rejectJoinRequest } from "@/lib/issueUtils/rejectJoinRequest";
import { Ban, Filter, Plus } from "lucide-react";

interface DataTableProps {
  data: ClassJoinRequest[];
  columns: ColumnDef<ClassJoinRequest>[];
  updateJoinRequests: (issueId: string) => void;
}

export function ClassJoinRequestsDataTable({
  columns,
  data,
  updateJoinRequests,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const handleAddUser = async (request: ClassJoinRequest) => {
    try {
      await addUserToClass(request.issueId, request.user.email, request.classId);
      toast({
        title: "Success",
        description: `${request.user.name} has been added to ${request.classTitle}`,
      });
      updateJoinRequests(request.issueId);
    } catch (error) {
      console.error("Error adding user to class:", error);
      toast({
        title: "Error",
        description: "Failed to add user to class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (request: ClassJoinRequest) => {
    try {
      await rejectJoinRequest(request.issueId);
      toast({
        title: "Success",
        description: `Join request from ${request.user.name} has been rejected`,
      });
      updateJoinRequests(request.issueId);
    } catch (error) {
      console.error("Error rejecting join request:", error);
      toast({
        title: "Error",
        description: "Failed to reject join request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const tableColumns: ColumnDef<ClassJoinRequest>[] = [
    ...columns,
    {
      id: "actions",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <div className="flex justify-end gap-x-4 pr-4">
            <button 
              className="bg-green-600 px-1 rounded-lg hover:bg-green-300" 
              title="Add to class"
              onClick={() => handleAddUser(request)}
            >
              <Plus className="h-6 w-6 text-white"/>
            </button>
            <button 
              className="bg-red-600 px-1 py-1 rounded-lg hover:bg-red-300" 
              title="Reject request"
              onClick={() => handleRejectRequest(request)}
            >
              <Ban className="h-6 w-6 text-black"/>
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <h2 className="pl-2 font-semibold text-xl">Join Class Requests</h2>
        <div className="flex gap-x-2 w-full max-w-md">
        <Input
          placeholder="Filter by student name..."
          value={(table.getColumn("user.name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("user.name")?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
        {/* TODO */}
        <Button>Filter<Filter className="pl-2"/></Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}