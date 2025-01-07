"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClusterServices } from "@/services/cluster/v1alpha1/cluster";
import { Cluster, Node, NodeGroup } from "@/types/types";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
import {
  initializeData,
  findNodeGroupTypeById,
  findNodeStatusById,
  findNodeRoleById,
} from "@/app/home/cluster/common";
import { LogBoard } from "@/components/ui/log";

export default function DetailsPage({
  params,
}: {
  params: { clusterid: string };
}) {
  const { toast } = useToast();

  const [nodeSorting, setNodeSorting] = useState<SortingState>([]);
  const [nodeColumnFilters, setNodeColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [nodeColumnVisibility, setNodeColumnVisibility] =
    useState<VisibilityState>({});
  const [nodeGroupSorting, setNodeGroupSorting] = useState<SortingState>([]);
  const [nodeGroupColumnFilters, setNodeGroupColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [nodeGroupColumnVisibility, setNodeGroupColumnVisibility] =
    useState<VisibilityState>({});
  const [logAutoScroll, setLogAutoScroll] = useState(true);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeGroups, setNodeGroups] = useState<NodeGroup[]>([]);

  const getClusterDetails = useCallback(() => {
    ClusterServices.getDetail(params.clusterid).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      const cluster = data as Cluster;
      if (cluster.node_groups?.length > 0) {
        setNodeGroups(cluster.node_groups);
      }
      if (cluster.nodes?.length > 0) {
        setNodes(cluster.nodes);
      }
    });
  }, [toast, params.clusterid]);

  useEffect(() => {
    initializeData();
    getClusterDetails();
  }, []);

  const nodeGroupColumns: ColumnDef<NodeGroup>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div>{findNodeGroupTypeById(row.getValue("type"))}</div>
      ),
    },
    {
      accessorKey: "os",
      header: "OS",
      cell: ({ row }) => <div>{row.getValue("os")}</div>,
    },
    {
      accessorKey: "arch",
      header: "Architecture",
      cell: ({ row }) => <div>{row.getValue("arch")}</div>,
    },
    {
      accessorKey: "cpu",
      header: "CPU",
      cell: ({ row }) => <div>{row.getValue("cpu")}</div>,
    },
    {
      accessorKey: "memory",
      header: "Memory/GB",
      cell: ({ row }) => <div>{row.getValue("memory")}</div>,
    },
    {
      accessorKey: "gpu",
      header: "GPU",
      cell: ({ row }) => <div>{row.getValue("gpu")}</div>,
    },
    {
      accessorKey: "gpu_spec",
      header: "GPU Spec",
      cell: ({ row }) => <div>{row.getValue("gpu_spec")}</div>,
    },
    {
      accessorKey: "system_disk_size",
      header: "System Disk/GB",
      cell: ({ row }) => <div>{row.getValue("system_disk_size")}</div>,
    },
    {
      accessorKey: "data_disk_size",
      header: "Data Disk/GB",
      cell: ({ row }) => <div>{row.getValue("data_disk_size")}</div>,
    },
    {
      accessorKey: "min_size",
      header: "Min Size",
      cell: ({ row }) => <div>{row.getValue("min_size")}</div>,
    },
    {
      accessorKey: "max_size",
      header: "Max Size",
      cell: ({ row }) => <div>{row.getValue("max_size")}</div>,
    },
    {
      accessorKey: "target_size",
      header: "Target Size",
      cell: ({ row }) => <div>{row.getValue("target_size")}</div>,
    },
  ];

  const nodeColumns: ColumnDef<Node>[] = [
    {
      accessorKey: "id",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "ip",
      header: "IP",
      cell: ({ row }) => <div>{row.getValue("ip")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div>{findNodeRoleById(row.getValue("role"))}</div>,
    },
    {
      accessorKey: "instance_id",
      header: "Instance ID",
      cell: ({ row }) => <div>{row.getValue("instance_id")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div>{findNodeStatusById(row.getValue("status"))}</div>
      ),
    },
    {
      accessorKey: "update_at",
      header: "Update At",
      cell: ({ row }) => <div>{row.getValue("update_at")}</div>,
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
      <div className="flex-grow flex p-4 space-x-4">
        <div className="w-full space-y-4 overflow-y-auto">
          <div className="w-full overflow-x-auto">
            <div className="flex items-center py-4 ">
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
              <div className="text-center text-lg font-semibold mx-auto px-4">
                Node Groups
              </div>
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
                  {nodeGroupTable.getRowModel().rows.map((row) => (
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
                  ))}
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
          <div className="flex">
            <div className="w-full overflow-x-auto">
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
                <div className="text-center text-lg font-semibold mx-auto px-4">
                  Nodes
                </div>
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
                    {nodeTable.getRowModel().rows.map((row) => (
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
                    ))}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogAutoScroll(!logAutoScroll)}
                  >
                    logAutoScroll
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-md border h-[1000px] w-[600px] ml-3 mb-9">
                <LogBoard
                  initialLogs={[]}
                  clusterId={params.clusterid}
                  autoScroll={logAutoScroll}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
