"use client";
import { Button } from "@/components/ui/button";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useReducer,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClusterServices } from "@/services/cluster/v1alpha1/cluster";
import { Cluster, Node, NodeGroup, ClusterLogsRequest } from "@/types/types";
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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const POLLING_INTERVAL = 3000;
const TAIL_LINES = 30;

type State = {
  cluster: Cluster | null;
  nodes: Node[];
  nodeGroups: NodeGroup[];
  logs: string;
  currentLine: number;
};

type Action =
  | { type: "SET_CLUSTER"; payload: Cluster }
  | { type: "SET_NODES"; payload: Node[] }
  | { type: "SET_NODE_GROUPS"; payload: NodeGroup[] }
  | { type: "APPEND_LOGS"; payload: string; currentLine: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CLUSTER":
      return { ...state, cluster: action.payload };
    case "SET_NODES":
      return { ...state, nodes: action.payload };
    case "SET_NODE_GROUPS":
      return { ...state, nodeGroups: action.payload };
    case "APPEND_LOGS":
      return {
        ...state,
        logs: state.logs + action.payload,
        currentLine: action.currentLine,
      };
    default:
      return state;
  }
}

export default function DetailsPage({
  params,
}: {
  params: { clusterid: string };
}) {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, {
    cluster: null,
    nodes: [],
    nodeGroups: [],
    logs: "",
    currentLine: 0,
  });

  const [nodeSorting, setNodeSorting] = React.useState<SortingState>([]);
  const [nodeColumnFilters, setNodeColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [nodeColumnVisibility, setNodeColumnVisibility] =
    React.useState<VisibilityState>({});

  const [nodeGroupSorting, setNodeGroupSorting] = React.useState<SortingState>(
    []
  );
  const [nodeGroupColumnFilters, setNodeGroupColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [nodeGroupColumnVisibility, setNodeGroupColumnVisibility] =
    React.useState<VisibilityState>({});

  const logRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (logRef.current && autoScroll) {
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [autoScroll]);

  const getClusterDetails = useCallback(
    async (clusterID: string) => {
      try {
        const data = await ClusterServices.getDetail(clusterID);
        dispatch({ type: "SET_CLUSTER", payload: data });
        dispatch({ type: "SET_NODES", payload: data.nodes });
        dispatch({ type: "SET_NODE_GROUPS", payload: data.node_groups });
        scrollToBottom();
      } catch (error) {
        toast({
          title: "Error",
          description: "Error while fetching cluster data",
          duration: 5000,
        });
      }
    },
    [toast, scrollToBottom]
  );

  useEffect(() => {
    getClusterDetails(params.clusterid);
    const pollLogs = async () => {
      try {
        const logsRequest: ClusterLogsRequest = {
          cluster_id: params.clusterid,
          tail_lines: TAIL_LINES,
          cluster_name: "",
          current_line: state.currentLine,
        };

        const response = await ClusterServices.pollingLogs(logsRequest);
        dispatch({
          type: "APPEND_LOGS",
          payload: response.logs,
          currentLine: response.last_line,
        });
        // Call scrollToBottom after updating logs
        scrollToBottom();
      } catch (error) {
        console.error("Error polling logs:", error);
      }
    };

    // Initial poll
    pollLogs();

    // Set up interval for polling
    const intervalId = setInterval(pollLogs, POLLING_INTERVAL);

    // Clean up function
    return () => {
      clearInterval(intervalId);
    };
  }, [params.clusterid, scrollToBottom, state.currentLine, getClusterDetails]);

  useEffect(() => {
    scrollToBottom();
  }, [state.logs, scrollToBottom]);

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
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
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
      header: "Memory",
      cell: ({ row }) => <div>{row.getValue("memory")}</div>,
    },
    {
      accessorKey: "gpu",
      header: "GPU",
      cell: ({ row }) => <div>{row.getValue("gpu")}</div>,
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
    {
      accessorKey: "system_disk",
      header: "System Disk",
      cell: ({ row }) => <div>{row.getValue("system_disk")}</div>,
    },
    {
      accessorKey: "data_disk",
      header: "Data Disk",
      cell: ({ row }) => <div>{row.getValue("data_disk")}</div>,
    },
  ];

  const nodeGroupTable = useReactTable({
    data: state.nodeGroups,
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
      accessorKey: "node_price",
      header: "Node Price",
      cell: ({ row }) => <div>{row.getValue("node_price")}</div>,
    },
    {
      accessorKey: "pod_price",
      header: "Pod Price",
      cell: ({ row }) => <div>{row.getValue("pod_price")}</div>,
    },
    {
      accessorKey: "gpu_spec",
      header: "GPU Spec",
      cell: ({ row }) => <div>{row.getValue("gpu_spec")}</div>,
    },
    {
      accessorKey: "system_disk",
      header: "System Disk",
      cell: ({ row }) => <div>{row.getValue("system_disk")}</div>,
    },
    {
      accessorKey: "data_disk",
      header: "Data Disk",
      cell: ({ row }) => <div>{row.getValue("data_disk")}</div>,
    },
    {
      accessorKey: "status_string",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status_string")}</div>
      ),
    },
    {
      accessorKey: "error_info",
      header: "Error Info",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">{"...."}</div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="p-2">{row.getValue("error_info")}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];

  const nodeTable = useReactTable({
    data: state.nodes,
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
        <div className="w-2/3 space-y-4 overflow-y-auto">
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
        <div className="w-1/3 flex flex-col space-y-4 overflow-y-auto">
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-300">Logs</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoScroll(!autoScroll)}
                className="text-gray-300 border-gray-600"
              >
                {autoScroll ? "Disable Auto-scroll" : "Enable Auto-scroll"}
              </Button>
            </div>
            <div
              ref={logRef}
              className="flex-grow font-mono text-sm bg-black text-green-400 p-3 rounded h-[calc(100vh-300px)] overflow-auto scrollbar-thin scrollbar-hide hover:scrollbar-default"
            >
              <pre className="whitespace-pre-wrap">
                {state.logs + "\n".repeat(10)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
