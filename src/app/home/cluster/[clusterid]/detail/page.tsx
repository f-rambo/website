"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClusterServices } from "@/services/cluster/v1alpha1/cluster";
import { Cluster, Node } from "@/types/types";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ActivityLogIcon } from "@radix-ui/react-icons";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import YamlEditor from "@focus-reactive/react-yaml";

export default function DetailsPage({
  params,
}: {
  params: { clusterid: string };
}) {
  const { toast } = useToast();
  const clusterid = params.clusterid;
  const [cluster, setCluster] = useState<Cluster>();
  const [data, setData] = useState<Node[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [logs, setLogs] = useState<string>("");
  const [newNode, setNewNode] = useState<{}>();

  const getClusterMockData = useCallback(() => {
    ClusterServices.getClusterMockData().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Error",
          description: "Error while fetching cluster data",
          duration: 5000,
        });
        return;
      }
      const cluster = res as Cluster;
      if (!cluster.nodes || cluster.nodes.length === 0) {
        toast({
          title: "Error",
          description: "Cluster has no nodes",
          duration: 5000,
        });
        return;
      }
      const node = cluster.nodes[0];
      setNewNode({
        name: node?.name,
        external_ip: node?.external_ip,
        user: node?.user,
        password: node?.password,
        sudo_password: node?.sudo_password,
        role: node?.role,
      });
    });
  }, [toast]);

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
        setData(data.nodes);
        var element = document.getElementById("log");
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
        setLogs(data.logs);
      });
    },
    [toast]
  );

  useEffect(() => {
    getClusterDetails(clusterid);
    getClusterMockData();
  }, [clusterid, toast, getClusterDetails, getClusterMockData]);

  const deleteNode = (clusterid: string, nodeid: string) => {
    ClusterServices.deleteNode(clusterid, nodeid).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Delete node fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "Delete node success",
        description: "Node deleted successfully",
        duration: 5000,
      });
      getClusterDetails(clusterid);
    });
  };

  const removeNode = (clusterid: string, nodeid: string) => {
    ClusterServices.removeNode(clusterid, nodeid).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Remove node fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "Remove node success",
        description: "Node removed successfully",
        duration: 5000,
      });
      getClusterDetails(clusterid);
    });
  };

  const addNode = (node: Node) => {
    cluster?.nodes.push(node);
    ClusterServices.saveCluster(cluster).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Error",
          description: "Error while adding node",
          duration: 5000,
        });
        return;
      }
      getClusterDetails(clusterid);
      toast({
        title: "Success",
        description: "Node added successfully",
        duration: 5000,
      });
    });
  };

  const enableNode = (clusterid: string, nodeId: string) => {
    ClusterServices.addNode(clusterid, nodeId).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Error",
          description: "Error while adding node",
          duration: 5000,
          variant: "destructive",
        });
        return;
      }
      getClusterDetails(clusterid);
      toast({
        title: "Success",
        description: "Node added successfully",
        duration: 5000,
      });
    });
  };

  const deploy = () => {
    ClusterServices.setUpCluster(cluster?.id as string).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Error",
          description: "Error while setting up cluster",
          duration: 5000,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Deploying cluster...",
        description: "Wait for the cluster to be deployed",
        duration: 5000,
      });
    });
  };

  const unDeploy = () => {
    ClusterServices.uninstallCluster(cluster?.id as string).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Error",
          description: "Error while undeploying cluster",
          duration: 5000,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Undeploying cluster...",
        description: "Wait for the cluster to be undeployed",
        duration: 5000,
      });
    });
  };

  const columns: ColumnDef<Node>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      header: "OS Image",
      cell: ({ row }) => <div>{row.getValue("os_image")}</div>,
    },
    {
      accessorKey: "kernel",
      header: "Kernel",
      cell: ({ row }) => <div>{row.getValue("kernel")}</div>,
    },
    {
      accessorKey: "container",
      header: "Container",
      cell: ({ row }) => <div>{row.getValue("container")}</div>,
    },
    {
      accessorKey: "kube_proxy",
      header: "Kube Proxy",
      cell: ({ row }) => <div>{row.getValue("kube_proxy")}</div>,
    },
    {
      accessorKey: "internal_ip",
      header: "Internal IP",
      cell: ({ row }) => <div>{row.getValue("internal_ip")}</div>,
    },
    {
      accessorKey: "external_ip",
      header: "External IP",
      cell: ({ row }) => <div>{row.getValue("external_ip")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("state")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const node = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(String(node.id))}
              >
                Copy node ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={node.state !== "init"}
                onClick={() => enableNode(clusterid, node.id)}
              >
                Enable node
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={node.state !== "running"}
                onClick={() => removeNode(clusterid, node.id)}
              >
                Remove node
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={node.state === "running"}
                onClick={() => deleteNode(clusterid, node.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="w-full">
              <div className="flex items-center py-4">
                <Input
                  placeholder="Filter nodes..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
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
                    {table
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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Node</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add a new node</DialogTitle>
                      <DialogDescription>
                        Write information about a new node.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 overflow-y-auto h- w-full">
                      <YamlEditor
                        json={newNode}
                        onChange={(e) => setNewNode(e.json)}
                      />
                    </div>
                    <DialogFooter className="sm:justify-end">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          onClick={() => addNode(newNode as Node)}
                        >
                          Submit
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
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
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
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
                          colSpan={columns.length}
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
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                  {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button
                      className="ml-3"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const selectedIds = table
                          .getFilteredSelectedRowModel()
                          .rows.map((row) => row.id);
                        // Use selectedIds for further processing
                        console.log(selectedIds);
                      }}
                    >
                      Delete selected
                    </Button>
                  )}
                </div>
                <div className="space-x-2">
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
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="flex items-center mt-2">
                <ActivityLogIcon className="h-6 w-6 mr-3" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="outline">
                      Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={cluster?.state === "running"}
                      onClick={deploy}
                    >
                      Reinstall
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={cluster?.state !== "running"}
                      onClick={unDeploy}
                    >
                      Uninstall
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Cluster information</h3>
              <div className="flex items-center mt-4">
                <ScrollArea className="w-full rounded-md border">
                  <div className="p-4">
                    <div className="text-gray-600">
                      Cluster name : {cluster?.name}
                    </div>
                    <Separator className="my-2" />
                    <div className="text-gray-600">
                      Server version : {cluster?.server_version}
                    </div>
                    <Separator className="my-2" />
                    <div className="text-gray-600">
                      Api server address : {cluster?.api_server_address}
                    </div>
                    <Separator className="my-2" />
                    <div className="text-gray-600">
                      Cluster state : {cluster?.state}
                    </div>
                    <Separator className="my-2" />
                    <div className="text-gray-600">
                      Node count : {cluster?.nodes.length}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Logs</h3>
              <div id="log" className="overflow-y-auto h-96 text-gray-600">
                <pre>{logs}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
