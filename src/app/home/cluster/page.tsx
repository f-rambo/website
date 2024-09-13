"use client";
import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  Cross2Icon,
  DoubleArrowDownIcon,
  CheckIcon,
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
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cluster } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ClusterServices } from "@/services/cluster/v1alpha1/cluster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const clusterTypes = [
  {
    value: "aws",
    label: "AWS Cloud",
  },
  {
    value: "azure",
    label: "Azure Cloud",
  },
  {
    value: "google",
    label: "Google Cloud",
  },
  {
    value: "kubernetes",
    label: "Kubernetes",
  },
  {
    value: "customizable",
    label: "Customizable",
  },
];

export default function ClusterListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<Cluster[]>([]);
  const [openClusterType, setOpenClusterType] = React.useState(false);
  const [clusterTypeValue, setClusterTypeValue] = React.useState("");

  const refreshClusterList = React.useCallback(() => {
    ClusterServices.getList().then((data) => {
      if (data instanceof Error) {
        toast({
          title: "Get cluster items fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      setData(data.clusters as Cluster[]);
    });
  }, [toast]);

  const GetCurrentCluster = () => {
    ClusterServices.GetCurrentCluster().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get current cluster fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      ClusterServices.saveCluster(res).then((res) => {
        if (res instanceof Error) {
          toast({
            title: "Save current cluster fail",
            variant: "destructive",
            description: res.message,
          });
          return;
        }
        refreshClusterList();
      });
      toast({
        title: "Get current cluster success",
        description: "Current cluster has been fetched",
      });
    });
  };

  const deleteCluster = (clusterID: string) => {
    ClusterServices.deleteCluster(clusterID).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Delete cluster fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "Delete cluster success",
        description: "Cluster has been deleted",
      });
      refreshClusterList();
    });
  };

  const uninstallCluster = (clusterID: string) => {
    ClusterServices.uninstallCluster(clusterID).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Uninstall cluster fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "Uninstall cluster success",
        description: "Cluster has been uninstalled",
      });
      refreshClusterList();
    });
  };

  React.useEffect(() => {
    refreshClusterList();
  }, [refreshClusterList]);

  const columns: ColumnDef<Cluster>[] = [
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
      accessorKey: "server_version",
      header: "Server Version",
      cell: ({ row }) => <div>{row.getValue("server_version")}</div>,
    },
    {
      accessorKey: "api_server_address",
      header: "Api Server Address",
      cell: ({ row }) => <div>{row.getValue("api_server_address")}</div>,
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("state")}</div>
      ),
    },
    {
      accessorKey: "is_current_cluster",
      header: "Current Cluster",
      cell: ({ row }) => (
        <div className="capitalize">
          {(row.getValue("is_current_cluster") as boolean) ? (
            <CheckIcon className="ml-2  h-4 w-4" />
          ) : (
            <Cross2Icon className="ml-2  h-4 w-4" />
          )}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const cluster = row.original;

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
                onClick={() =>
                  navigator.clipboard.writeText(String(cluster.id))
                }
              >
                Copy cluster ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => (window.location.href = `cluster/${cluster.id}`)}
              >
                Projects
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`cluster/${cluster.id}/detail`)}
              >
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.state !== "running" || cluster.config === ""}
                onClick={() => uninstallCluster(cluster?.id)}
              >
                UnDeploy
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.state === "running"}
                onClick={() => {
                  router.push(`/home/cluster/new?clusterid=${cluster.id}`);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.state === "running"}
                onClick={() => deleteCluster(cluster?.id)}
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
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter clusters..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
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
            <Button variant="outline">New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Cluster</DialogTitle>
              <DialogDescription>Select a cluster type</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Cluster Type</Label>
                <Popover
                  open={openClusterType}
                  onOpenChange={setOpenClusterType}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openClusterType}
                      className="w-[300px] justify-between"
                    >
                      {clusterTypeValue
                        ? clusterTypes.find(
                            (clustertype) =>
                              clustertype.value === clusterTypeValue
                          )?.label
                        : "Select cluster type..."}
                      <DoubleArrowDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search cluster type..." />
                      <CommandEmpty>No cluster type found.</CommandEmpty>
                      <CommandGroup>
                        {clusterTypes.map((clusterType) => (
                          <CommandItem
                            key={clusterType.value}
                            value={clusterType.value}
                            onSelect={(currentValue) => {
                              setClusterTypeValue(
                                currentValue === clusterTypeValue
                                  ? ""
                                  : currentValue
                              );
                              setOpenClusterType(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                clusterTypeValue === clusterType.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {clusterType.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (clusterTypeValue === "") {
                      toast({
                        title: "Please select a cluster type",
                        variant: "destructive",
                        description:
                          "Please select a cluster type to create a new cluster",
                      });
                      return;
                    }
                    if (clusterTypeValue === "customizable") {
                      router.push(`cluster/new`);
                    }
                    setClusterTypeValue("");
                  }}
                >
                  Next
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
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => GetCurrentCluster()}
                    >
                      Get cluster information
                    </Button>
                    <p className="mt-6">No results...</p>
                  </div>
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
  );
}
