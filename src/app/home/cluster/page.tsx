"use client";
import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  DoubleArrowDownIcon,
  CheckIcon,
  ReloadIcon,
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
import { Cluster, ClusterArgs, Region } from "@/types/types";
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
import { Textarea } from "@/components/ui/textarea";
import {
  initializeData,
  getClusterAllTypes,
  findClusterTypeById,
  findClusterStatusById,
  findClusterTypeByName,
  isClusterCloudType,
} from "@/app/home/cluster/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [clusterItems, setClusterItems] = React.useState<Cluster[]>([]);
  const [openClusterType, setOpenClusterType] = React.useState(false);
  const [newClusterDialogOpen, setNewClusterDialogOpen] = React.useState(false);
  const [confirmedDialogOpen, setConfirmedDialogOpen] = React.useState(false);
  const [confirmedType, setConfirmedType] = React.useState<string>("");
  const [confirmedValue, setConfirmedValue] = React.useState<string>("");
  const confirmedTypeStartCluster = "start";
  const confirmedTypeStopCluster = "stop";
  const confirmedTypeDeleteCluster = "delete";
  const exampleClusterArgs: ClusterArgs = {
    id: "0", // backend is int64, so we use "0" to represent empty
    name: "",
    type: 0,
    private_key: "",
    public_key: "",
    access_id: "",
    access_key: "",
    region: "",
    node_username: "",
    node_start_ip: "",
    node_end_ip: "",
    edit: false,
  };
  const [regions, setRegions] = React.useState<Region[]>([]);

  const [clusterArgs, setClusterArgs] =
    React.useState<ClusterArgs>(exampleClusterArgs);

  const clearClusterForm = () => {
    setClusterArgs(exampleClusterArgs);
  };

  const updateClusterArgs = (changes: any) => {
    setClusterArgs((prevState) => ({
      ...prevState,
      ...changes,
    }));
  };

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
      setClusterItems(data.clusters as Cluster[]);
    });
  }, [toast]);

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

  const getClusterDetailAndSetClusterArgs = (clusterID: string) => {
    ClusterServices.getDetail(clusterID).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get cluster detail fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      const cluster = res as Cluster;
      updateClusterArgs({
        id: cluster.id,
        name: cluster.name,
        type: cluster.type,
        public_key: cluster.public_key,
        private_key: cluster.private_key,
        access_id: cluster.access_id,
        access_key: cluster.access_key,
        region: cluster.region,
        node_username: cluster.node_username,
        node_start_ip: cluster.node_start_ip,
        node_end_ip: cluster.node_end_ip,
        edit: true,
      });
    });
  };

  const createCluster = () => {
    ClusterServices.saveCluster(clusterArgs).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Save cluster fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      refreshClusterList();
      clearClusterForm();
    });
  };

  const startCluster = (clusterID: string) => {
    ClusterServices.startCluster(clusterID).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Start cluster fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "Starting cluster...",
        description: "Please wait for a moment",
      });
    });
  };

  const stopCluster = (clusterID: string) => {
    ClusterServices.stopCluster(clusterID).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Stop cluster fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "Stopping cluster...",
        description: "Please wait for a moment",
      });
    });
  };

  const getClusterRegions = (
    type: number,
    access_id: string,
    access_key: string
  ) => {
    if (access_id === "" || access_key === "") {
      return;
    }
    ClusterServices.getRegions(type, access_id, access_key).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get regions fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setRegions(res.regions as Region[]);
    });
  };

  const confirm = (confirmStatus: boolean) => {
    setConfirmedDialogOpen(false);
    if (confirmStatus === false) {
      setConfirmedType("");
      setConfirmedValue("");
      return;
    }
    if (confirmedType === confirmedTypeStartCluster) {
      startCluster(confirmedValue);
    }
    if (confirmedType === confirmedTypeStopCluster) {
      stopCluster(confirmedValue);
    }
    if (confirmedType === confirmedTypeDeleteCluster) {
      deleteCluster(confirmedValue);
    }
    setConfirmedType("");
    setConfirmedValue("");
    return;
  };

  React.useEffect(() => {
    refreshClusterList();
    initializeData();
  }, []);

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
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">
          {findClusterTypeById(row.getValue("type"))}
        </div>
      ),
    },
    {
      accessorKey: "version",
      header: "Kubernetes Version",
      cell: ({ row }) => <div>{row.getValue("version")}</div>,
    },
    {
      accessorKey: "api_server_address",
      header: "Api Server Address",
      cell: ({ row }) => <div>{row.getValue("api_server_address")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">
          {findClusterStatusById(row.getValue("status"))}
        </div>
      ),
    },
    {
      accessorKey: "region_name",
      header: "Region(Cloud)",
      cell: ({ row }) => <div>{row.getValue("region_name")}</div>,
    },
    {
      accessorKey: "node_start_ip",
      header: "Start IP(Local)",
      cell: ({ row }) => <div>{row.getValue("node_start_ip")}</div>,
    },
    {
      accessorKey: "node_end_ip",
      header: "END IP(Local)",
      cell: ({ row }) => <div>{row.getValue("node_end_ip")}</div>,
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
                onClick={() => router.push(`cluster/${cluster.id}/detail`)}
              >
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => (window.location.href = `cluster/${cluster.id}`)}
              >
                Projects
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.status === 1}
                onClick={() => {
                  setConfirmedType(confirmedTypeStartCluster);
                  setConfirmedValue(cluster.id);
                  setConfirmedDialogOpen(true);
                }}
              >
                Start
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.status !== 1}
                onClick={() => {
                  setConfirmedType(confirmedTypeStopCluster);
                  setConfirmedValue(cluster.id);
                  setConfirmedDialogOpen(true);
                }}
              >
                Stop
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.status === 1}
                onClick={() => {
                  getClusterDetailAndSetClusterArgs(cluster.id);
                  getClusterRegions(
                    cluster.type,
                    cluster.access_id,
                    cluster.access_key
                  );
                  setNewClusterDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.status === 1}
                onClick={() => {
                  setConfirmedType(confirmedTypeDeleteCluster);
                  setConfirmedValue(cluster.id);
                  setConfirmedDialogOpen(true);
                }}
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
    data: clusterItems,
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

        <Dialog
          open={newClusterDialogOpen}
          onOpenChange={setNewClusterDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                updateClusterArgs({ edit: false });
                setNewClusterDialogOpen(true);
              }}
            >
              New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Cluster</DialogTitle>
              <DialogDescription>Add/Edit</DialogDescription>
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
                      disabled={clusterArgs.edit}
                      variant="outline"
                      role="combobox"
                      aria-expanded={openClusterType}
                      className="col-span-3 justify-between"
                    >
                      {clusterArgs.type
                        ? getClusterAllTypes().find(
                            (clustertype) => clustertype.id === clusterArgs.type
                          )?.name
                        : "Select cluster type..."}
                      <DoubleArrowDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="col-span-3 p-0">
                    <Command>
                      <CommandInput placeholder="Search cluster type..." />
                      <CommandEmpty>No cluster type found.</CommandEmpty>
                      <CommandGroup>
                        {getClusterAllTypes().map((clusterType) => (
                          <CommandItem
                            disabled={clusterArgs.edit}
                            key={clusterType.id}
                            value={clusterType.name}
                            onSelect={() => {
                              updateClusterArgs({
                                type: findClusterTypeByName(clusterType.name),
                              });
                              setOpenClusterType(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                clusterArgs.type === clusterType.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {clusterType.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Cluster Name
                </Label>
                <Input
                  id="name"
                  disabled={clusterArgs.edit}
                  value={clusterArgs.name}
                  onChange={(e) => {
                    const regex = /^[A-Za-z0-9]*$/;
                    if (regex.test(e.target.value)) {
                      updateClusterArgs({ name: e.target.value });
                    }
                  }}
                  className={`col-span-3 ${
                    !clusterArgs.name ? "border-red-500" : ""
                  }`}
                  placeholder="Enter cluster name"
                  required
                />
                {!clusterArgs.name && (
                  <p className="col-span-3 col-start-2 text-red-500 text-sm mt-1">
                    Cluster name is required and must contain only letters and
                    numbers.
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="private_key" className="text-right">
                  Private Key
                </Label>
                <Textarea
                  id="private_key"
                  disabled={clusterArgs.edit}
                  value={clusterArgs.private_key}
                  className="col-span-3"
                  onChange={(e) => {
                    updateClusterArgs({ private_key: e.target.value });
                  }}
                  placeholder="Type your private key here."
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="public_key" className="text-right">
                  Public Key
                </Label>
                <Textarea
                  id="public_key"
                  disabled={clusterArgs.edit}
                  value={clusterArgs.public_key}
                  className="col-span-3"
                  onChange={(e) => {
                    updateClusterArgs({ public_key: e.target.value });
                  }}
                  placeholder="Type your public key here."
                  required
                />
              </div>
              {clusterArgs.type != 0 &&
                isClusterCloudType(clusterArgs.type) && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="access_id" className="text-right">
                        Access Id
                      </Label>
                      <Input
                        id="access_id"
                        value={clusterArgs.access_id}
                        onChange={(e) => {
                          updateClusterArgs({ access_id: e.target.value });
                        }}
                        className="col-span-3"
                        placeholder="Access Id"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="access_key" className="text-right">
                        Access Key
                      </Label>
                      <Input
                        id="access_key"
                        value={clusterArgs.access_key}
                        onChange={(e) => {
                          updateClusterArgs({ access_key: e.target.value });
                        }}
                        className="col-span-3"
                        placeholder="Access Key"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="region" className="text-right">
                        Region
                      </Label>
                      <div className="flex items-center space-x-4 w-[300px]">
                        <Select
                          disabled={clusterArgs.edit}
                          value={clusterArgs.region}
                          onValueChange={(val) => {
                            updateClusterArgs({ region: val });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region.id} value={region.id}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className="w-10"
                          onClick={() =>
                            getClusterRegions(
                              clusterArgs.type,
                              clusterArgs.access_id,
                              clusterArgs.access_key
                            )
                          }
                        >
                          <ReloadIcon />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              {clusterArgs.type != 0 &&
                !isClusterCloudType(clusterArgs.type) && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="node_username" className="text-right">
                        Node Username
                      </Label>
                      <Input
                        id="node_username"
                        disabled={clusterArgs.edit}
                        value={clusterArgs.node_username}
                        onChange={(e) => {
                          updateClusterArgs({ node_username: e.target.value });
                        }}
                        className="col-span-3"
                        placeholder="root"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="node_start_ip" className="text-right">
                        Node Start Ip
                      </Label>
                      <Input
                        id="node_start_ip"
                        value={clusterArgs.node_start_ip}
                        onChange={(e) => {
                          updateClusterArgs({ node_start_ip: e.target.value });
                        }}
                        className="col-span-3"
                        placeholder="192.168.0.1"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="node_end_ip" className="text-right">
                        Node End Ip
                      </Label>
                      <Input
                        id="node_end_ip"
                        value={clusterArgs.node_end_ip}
                        onChange={(e) => {
                          updateClusterArgs({ node_end_ip: e.target.value });
                        }}
                        className="col-span-3"
                        placeholder="192.168.0.100"
                        required
                      />
                    </div>
                  </>
                )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (clusterArgs.type === 0) {
                      toast({
                        title: "Please select a cluster type",
                        variant: "destructive",
                        description:
                          "Please select a cluster type to create a new cluster",
                      });
                      return;
                    }
                    if (clusterArgs.name === "") {
                      toast({
                        title: "Please enter a cluster name",
                        variant: "destructive",
                        description:
                          "Please enter a cluster name to create a new cluster",
                      });
                      return;
                    }
                    if (clusterArgs.public_key === "") {
                      toast({
                        title: "Please enter a public key",
                        variant: "destructive",
                        description:
                          "Please enter a public key to create a new cluster",
                      });
                      return;
                    }
                    if (
                      clusterArgs.access_id === "" &&
                      isClusterCloudType(clusterArgs.type)
                    ) {
                      toast({
                        title: "Please enter a access id",
                        variant: "destructive",
                        description:
                          "Please enter a access id to create a new cluster",
                      });
                      return;
                    }
                    if (
                      clusterArgs.access_key === "" &&
                      isClusterCloudType(clusterArgs.type)
                    ) {
                      toast({
                        title: "Please enter a access key",
                        variant: "destructive",
                        description:
                          "Please enter a access key to create a new cluster",
                      });
                      return;
                    }
                    if (
                      clusterArgs.node_start_ip === "" &&
                      !isClusterCloudType(clusterArgs.type)
                    ) {
                      toast({
                        title: "Please enter a node start ip",
                        variant: "destructive",
                        description:
                          "Please enter a node start ip to create a new cluster",
                      });
                      return;
                    }
                    if (
                      clusterArgs.node_end_ip === "" &&
                      !isClusterCloudType(clusterArgs.type)
                    ) {
                      toast({
                        title: "Please enter a node end ip",
                        variant: "destructive",
                        description:
                          "Please enter a node end ip to create a new cluster",
                      });
                      return;
                    }
                    createCluster();
                  }}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <AlertDialog
          open={confirmedDialogOpen}
          onOpenChange={setConfirmedDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will {confirmedType} cluster
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  confirm(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  confirm(true);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                  <p className="mt-6">No results...</p>
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
