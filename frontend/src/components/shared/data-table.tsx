"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { PaginationControls } from "./pagination-controls";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  isLoading: boolean;

  enablePagination?: boolean;
  currentPage?: number;
  currentLimit?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  //   onLimitChange: (limit: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enablePagination = true,
  totalItems = 0,
  currentPage = 1,
  currentLimit = 10,
  isLoading = false,
  onPageChange,
  columnVisibility,
  onColumnVisibilityChange,
}: //   onLimitChange,
DataTableProps<TData, TValue> & {}) {
  const { t } = useTranslation();
  const totalPages = enablePagination
    ? Math.ceil(totalItems / currentLimit)
    : 1;

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: enablePagination,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    pageCount: enablePagination ? totalPages : undefined,
    onColumnVisibilityChange: (updater) => {
      if (onColumnVisibilityChange) {
        const newValue =
          typeof updater === "function"
            ? updater(columnVisibility ?? {})
            : updater;
        onColumnVisibilityChange(newValue);
      }
    },
    state: {
      rowSelection: rowSelection,
      ...(enablePagination && {
        pagination: { pageIndex: currentPage - 1, pageSize: currentLimit },
      }),
      columnVisibility,
    },
    rowCount: totalItems,
  });

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 overflow-auto border border-ui-border rounded-sm">
        <Table className="text-xs w-full ">
          <TableHeader className="w-full bg-ui-column">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="w-full">
                {hg.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="border-r-2 last:border-r-0 border-ui-border"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="h-full grow shrink-0 border-b border-ui-border">
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  <Loader className="size-10 mx-auto animate-spin text-brand-default" />
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              (table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-10 bg-ui-row-odd even:bg-ui-row-even hover:bg-ui-row-hover"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className=" border-r last:border-r-0 border-ui-border box-border "
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("messages.info.no_results")}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {enablePagination && (
        <div className="shrink-0 mt-4">
          <PaginationControls
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange!}
          />
        </div>
      )}
    </div>
  );
}
