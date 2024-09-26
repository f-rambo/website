"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClusterServices } from "@/services/cluster/v1alpha1/cluster";
import { Cluster, Node, NodeGroup } from "@/types/types";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function DetailsPage({
  params,
}: {
  params: { clusterid: string };
}) {
  const { toast } = useToast();
  const clusterid = params.clusterid;
  const [cluster, setCluster] = useState<Cluster>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeSorting, setNodeSorting] = React.useState<SortingState>([]);
  const [nodeColumnFilters, setNodeColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [nodeColumnVisibility, setNodeColumnVisibility] =
    React.useState<VisibilityState>({});
  const [nodeGroups, setNodeGroups] = useState<NodeGroup[]>([]);
  const [nodeGroupSorting, setNodeGroupSorting] = React.useState<SortingState>(
    []
  );
  const [nodeGroupColumnFilters, setNodeGroupColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [nodeGroupColumnVisibility, setNodeGroupColumnVisibility] =
    React.useState<VisibilityState>({});

  const getClusterDetails = useCallback(
    (clusterID: string) => {
      ClusterServices.getDetail(clusterID).then((res) => {
        if (res instanceof Error) {
          toast({
            title: "Error",
            description: "Error while fetching cluster data",
            duration: 5000,
          });
          return;
        }
        const data = res as Cluster;
        setCluster(data);
        setNodes(data.nodes);
        setNodeGroups(data.node_groups);
        var element = document.getElementById("log");
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
      });
    },
    [toast]
  );

  useEffect(() => {
    getClusterDetails(clusterid);
  }, [clusterid, toast, getClusterDetails]);

  const nodeGroupColumns: ColumnDef<NodeGroup>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-4">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-4">{row.getValue("name")}</div>
      ),
    },
  ];

  const nodeGroupTable = useReactTable({
    data: nodeGroups,
    columns: nodeGroupColumns,
    onSortingChange: setNodeGroupSorting,
    onColumnFiltersChange: setNodeGroupColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setNodeGroupColumnVisibility,
    state: {
      sorting: nodeGroupSorting,
      columnFilters: nodeGroupColumnFilters,
      columnVisibility: nodeGroupColumnVisibility,
    },
  });

  const nodeColumns: ColumnDef<Node>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-4">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-4">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "os_image",
      header: "OS",
      cell: ({ row }) => <div>{row.getValue("os_image")}</div>,
    },
    {
      accessorKey: "container",
      header: "Container",
      cell: ({ row }) => <div>{row.getValue("container")}</div>,
    },
    {
      accessorKey: "internal_ip",
      header: "IP",
      cell: ({ row }) => <div>{row.getValue("internal_ip")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
      accessorKey: "status_string",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status_string")}</div>
      ),
    },
  ];

  const nodeTable = useReactTable({
    data: nodes,
    columns: nodeColumns,
    onSortingChange: setNodeSorting,
    onColumnFiltersChange: setNodeColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setNodeColumnVisibility,
    state: {
      sorting: nodeSorting,
      columnFilters: nodeColumnFilters,
      columnVisibility: nodeColumnVisibility,
    },
  });

  return (
    <div className="flex h-screen">
      <div className="flex-grow grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3 space-y-4 overflow-y-auto">
          <div className="w-full">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter node groups..."
                value={
                  (nodeGroupTable
                    .getColumn("name")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  nodeGroupTable
                    .getColumn("name")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto mr-3">
                    Columns <ChevronDownIcon className="ml-2  h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {nodeGroupTable
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {nodeGroupTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
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
                <TableBody>
                  {nodeGroupTable.getRowModel().rows?.length ? (
                    nodeGroupTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
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
                        colSpan={nodeColumns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => nodeGroupTable.previousPage()}
                  disabled={!nodeGroupTable.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => nodeGroupTable.nextPage()}
                  disabled={!nodeGroupTable.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter nodes..."
                value={
                  (nodeTable.getColumn("name")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  nodeTable
                    .getColumn("name")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto mr-3">
                    Columns <ChevronDownIcon className="ml-2  h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {nodeTable
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {nodeTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
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
                <TableBody>
                  {nodeTable.getRowModel().rows?.length ? (
                    nodeTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
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
                        colSpan={nodeColumns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => nodeTable.previousPage()}
                  disabled={!nodeTable.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => nodeTable.nextPage()}
                  disabled={!nodeTable.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col space-y-4 h-full">
          <div className="bg-gray-100 p-4 rounded flex-shrink-0">
            <h3 className="text-lg font-semibold">Cluster information</h3>
            <div className="flex items-center mt-4">
              <ScrollArea className="w-full rounded-md border">
                <div className="p-4">
                  <div className="text-gray-600">
                    Cluster name : {cluster?.name}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-gray-600">
                    Server version : {cluster?.version}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-gray-600">
                    Api server address : {cluster?.api_server_address}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-gray-600">
                    Cluster status : {cluster?.status_string}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-gray-600">
                    Node count : {cluster?.nodes.length}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-300">Logs</h3>
            </div>
            <div
              id="log"
              className="font-mono text-sm bg-black text-green-400 p-3 rounded overflow-y-auto flex-grow"
            >
              <pre className="whitespace-pre-wrap">
                {`
$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-6799fc88d8-rx9kw   1/1     Running   0          2d12h
redis-master-1           1/1     Running   0          5d20h
                `}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
