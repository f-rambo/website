"use client";
import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
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
import {
  Cluster,
  ClusterType,
  ClusterArgs,
  NodeArgs,
  ClusterStatus,
  ClusterLevel,
  NodeStatus,
  NodeGroupType,
  NodeRole,
  ResourceType,
} from "@/types/types";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import YamlEditor from "@focus-reactive/react-yaml";

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
  const [newClusterDetailDialogOpen, setNewClusterDetailDialogOpen] =
    React.useState(false);
  const [clusterRegions, setClusterRegions] = React.useState<string[]>([]);
  const [clusterTypes, setClusterTypes] = React.useState<ClusterType[]>([]);
  const [clusterStatuses, setClusterStatuses] = React.useState<ClusterStatus[]>(
    []
  );
  const [clusterLevels, setClusterLevels] = React.useState<ClusterLevel[]>([]);
  const [nodeStatuses, setNodeStatuses] = React.useState<NodeStatus[]>([]);
  const [nodeGroupTypes, setNodeGroupTypes] = React.useState<NodeGroupType[]>(
    []
  );
  const [nodeRoles, setNodeRoles] = React.useState<NodeRole[]>([]);
  const [resourceTypes, setResourceTypes] = React.useState<ResourceType[]>([]);

  const exampleClusterArgs: ClusterArgs = {
    id: "0", // backend is int64, so we use "0" to represent empty
    name: "",
    type: 0,
    private_key: "",
    public_key: "",
    region: "",
    access_id: "",
    access_key: "",
    nodes: [
      {
        id: "-1",
        ip: "192.168.1.1",
        user: "root",
        role: 1,
      },
    ],
    edit: false,
  };
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
      console.log(cluster);
      var nodeargs: NodeArgs[] = [];
      cluster.nodes.forEach((node) => {
        nodeargs.push({
          id: node.id,
          ip: node.internal_ip,
          user: node.user,
          role: node.role,
        });
      });
      updateClusterArgs({
        id: cluster.id,
        name: cluster.name,
        type: cluster.type,
        public_key: cluster.public_key,
        private_key: cluster.private_key,
        access_id: cluster.access_id,
        access_key: cluster.access_key,
        region: cluster.region,
        nodes: nodeargs,
      });
    });
  };

  const createCluster = (step: number) => {
    ClusterServices.saveCluster(clusterArgs).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Save cluster fail",
          variant: "destructive",
          description: res.message,
        });
        setNewClusterDetailDialogOpen(false);
        return;
      }
      refreshClusterList();
      const clusterDetail = res as Cluster;
      updateClusterArgs({ id: clusterDetail.id });
      if (step === 2) {
        toast({
          title: "Save cluster success",
          description: "Cluster has been saved",
        });
        clearClusterForm();
        return;
      }
      ClusterServices.getClusterRegion(clusterDetail.id).then((res) => {
        if (res instanceof Error) {
          toast({
            title: "Get cluster region fail",
            variant: "destructive",
            description: res.message,
          });
          return;
        }
        setClusterRegions(res.regions as string[]);
      });
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

  const getClusterTypes = () => {
    ClusterServices.getClusterTypes().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get cluster types fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setClusterTypes(res.cluster_types as ClusterType[]);
    });
  };

  // GetClusterStatuses
  const getClusterStatuses = () => {
    ClusterServices.getClusterStatuses().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get cluster statuses fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setClusterStatuses(res.cluster_statuses as ClusterStatus[]);
    });
  };

  // GetClusterLevels
  const getClusterLevels = () => {
    ClusterServices.getClusterLevels().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get cluster levels fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setClusterLevels(res.cluster_levels as ClusterLevel[]);
    });
  };

  // GetNodeRoles
  const getNodeRoles = () => {
    ClusterServices.getNodeRoles().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get node roles fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setNodeRoles(res.node_roles as NodeRole[]);
    });
  };

  // GetNodeStatuses
  const getNodeStatuses = () => {
    ClusterServices.getNodeStatuses().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get node statuses fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setNodeStatuses(res.node_statuses as NodeStatus[]);
    });
  };

  // GetNodeGroupTypes
  const getNodeGroupTypes = () => {
    ClusterServices.getNodeGroupTypes().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get node group types fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setNodeGroupTypes(res.node_group_types as NodeGroupType[]);
    });
  };

  // GetResourceTypes
  const getResourceTypes = () => {
    ClusterServices.getResourceTypes().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Get resource types fail",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setResourceTypes(res.resource_types as ResourceType[]);
    });
  };

  const isClusterCloudType = (type: number) => {
    const clusterType = clusterTypes.find((clusterType) => {
      return clusterType.id === type;
    });
    return clusterType?.is_cloud;
  };

  const findClusterTypeByName = (name: string) => {
    const clusterType = clusterTypes.find((clusterType) => {
      return clusterType.name === name;
    });
    return clusterType?.id;
  };

  const findClusterTypeById = (id: number) => {
    if (id === 0) {
      return "Unknown";
    }
    const clusterType = clusterTypes.find((clusterType) => {
      return clusterType.id === id;
    });
    return clusterType?.name;
  };

  const findClusterStatusById = (id: number) => {
    if (id === 0) {
      return "Unknown";
    }
    const clusterStatus = clusterStatuses.find((clusterStatus) => {
      return clusterStatus.id === id;
    });
    return clusterStatus?.name;
  };

  React.useEffect(() => {
    refreshClusterList();
    getClusterTypes();
    getClusterStatuses();
    getClusterLevels();
    getNodeRoles();
    getNodeStatuses();
    getNodeGroupTypes();
    getResourceTypes();
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
                disabled={cluster.status === 1}
                onClick={() => {
                  startCluster(cluster.id);
                  router.push(`cluster/${cluster.id}/detail`);
                }}
              >
                Start
              </DropdownMenuItem>
              <DropdownMenuItem disabled={cluster.status !== 1}>
                Stop
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`cluster/${cluster.id}/detail`)}
              >
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.status === 1}
                onClick={() => {
                  getClusterDetailAndSetClusterArgs(cluster.id);
                  updateClusterArgs({ edit: true });
                  setNewClusterDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={cluster.status === 1}
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
              <DialogTitle>New Cluster</DialogTitle>
              <DialogDescription>
                Fill in the cluster information (1/2)
              </DialogDescription>
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
                      className="col-span-3 justify-between"
                    >
                      {clusterArgs.type
                        ? clusterTypes.find(
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
                        {clusterTypes.map((clusterType) => (
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
                  value={clusterArgs.private_key}
                  className="col-span-3"
                  onChange={(e) => {
                    updateClusterArgs({ private_key: e.target.value });
                  }}
                  placeholder="Type your private key here."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="public_key" className="text-right">
                  Public Key
                </Label>
                <Textarea
                  id="public_key"
                  value={clusterArgs.public_key}
                  className="col-span-3"
                  onChange={(e) => {
                    updateClusterArgs({ public_key: e.target.value });
                  }}
                  placeholder="Type your public key here."
                />
              </div>
              {clusterArgs && isClusterCloudType(clusterArgs.type) && (
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
                    createCluster(1);
                    setNewClusterDetailDialogOpen(true);
                  }}
                >
                  Next
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* ------------------------------ */}
        <Dialog
          open={newClusterDetailDialogOpen}
          onOpenChange={setNewClusterDetailDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Cluster</DialogTitle>
              {!isClusterCloudType(clusterArgs.type) && (
                <DialogDescription>Node information (2/2)</DialogDescription>
              )}
              {isClusterCloudType(clusterArgs.type) && (
                <DialogDescription>Cluster Region (2/2)</DialogDescription>
              )}
            </DialogHeader>
            {isClusterCloudType(clusterArgs.type) && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="region" className="text-right">
                  Region
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateClusterArgs({ region: value })
                  }
                >
                  <SelectTrigger className="col-span-3 p-3">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Regions</SelectLabel>
                      {clusterRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            {!isClusterCloudType(clusterArgs.type) && (
              <div className="grid grid-cols-1 items-center gap-4">
                <div className="h-96 w-full">
                  <Label htmlFor="region" className="text-right">
                    Master role : 1, Woker role : 2, Edge role : 3 \\ node
                    example id default : 0
                  </Label>
                  <YamlEditor
                    json={clusterArgs.nodes}
                    onChange={(e) => {
                      updateClusterArgs({ nodes: e.json as NodeArgs[] });
                    }}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="submit"
                  onClick={() => {
                    createCluster(2);
                  }}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* ------------------------------ */}
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
