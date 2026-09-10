"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  selectedRowId?: string | null;
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  enableSorting?: boolean;
  enablePagination?: boolean;
  initialPageSize?: number;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<TData>({
  data,
  columns,
  selectedRowId,
  getRowId,
  onRowClick,
  enableSorting = true,
  enablePagination = false,
  initialPageSize = 10,
  emptyMessage = "No records found.",
  className = "",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : [],
      pagination: enablePagination ? pagination : undefined,
    },
    onSortingChange: enableSorting ? setSorting : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getRowId: getRowId,
  });

  const rows = table.getRowModel().rows;

  return (
    <div className={`overflow-hidden font-mono ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-zinc-950 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize() !== 150 ? header.getSize() : undefined,
                      }}
                      className={`p-3 select-none ${
                        canSort ? "cursor-pointer hover:text-zinc-200 transition-colors" : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {canSort && (
                          <span className="inline-flex">
                            {isSorted === "asc" ? (
                              <ChevronUp className="w-3.5 h-3.5 text-brand-cyan" />
                            ) : isSorted === "desc" ? (
                              <ChevronDown className="w-3.5 h-3.5 text-brand-cyan" />
                            ) : (
                              <ChevronsUpDown className="w-3 h-3 text-zinc-600 opacity-60" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-panel-border bg-zinc-950/20">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-zinc-500 text-xs"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isSelected = selectedRowId && row.id === selectedRowId;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={`transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${
                      isSelected
                        ? "bg-brand-cyan/10 border-l-2 border-brand-cyan"
                        : "hover:bg-zinc-900/40"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Optional Pagination Footer */}
      {enablePagination && table.getPageCount() > 1 && (
        <div className="p-3 border-t border-panel-border bg-[var(--panel-header-bg)] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>
              Page <strong className="text-zinc-200">{table.getState().pagination.pageIndex + 1}</strong> of{" "}
              <strong className="text-zinc-200">{table.getPageCount()}</strong>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-[11px] text-zinc-500">
              {data.length} total rows
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded border border-panel-border bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded border border-panel-border bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
