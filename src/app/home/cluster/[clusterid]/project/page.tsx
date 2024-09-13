"use client";
import * as React from "react";
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
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Project, Technology, Business } from "@/types/types";
import { ProjectServices } from "@/services/project/v1alpha1/project";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BusinessCheckedStates {
  [key: string]: boolean;
}

export default function AppRepoPage({
  params,
}: {
  params: { clusterid: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const clusterid = params.clusterid;
  const [data, setData] = React.useState<Project[]>([]);
  const [AddEditProjectOpen, setAddEditProjectOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");
  const [projectDescription, setProjectDescription] = React.useState("");
  const [projectid, setProjectid] = React.useState("");
  const [projectMockData, setProjectMockData] = React.useState<Project | null>(
    null
  );
  const [business, setBusiness] = React.useState<Business[]>([]);
  const [technologys, setTechnologys] = React.useState<Technology[]>([]);
  const [businessCheckedStates, setBusinessCheckedStates] =
    React.useState<BusinessCheckedStates>({});
  const [technologyCheckedStates, setTechnologyCheckedStates] =
    React.useState<BusinessCheckedStates>({});
  const [businessCheckeName, setBusinessCheckeName] =
    React.useState<string>("");
  const [technologyCheckeName, setTechnologyCheckeName] =
    React.useState<string>("");

  const getProjectMockData = React.useCallback(() => {
    if (projectMockData !== null) {
      return;
    }
    ProjectServices.getProjectMockData().then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project items fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      const porject = data as Project;
      setProjectMockData(porject);
      setBusiness(porject.business);
    });
  }, [toast, projectMockData]);

  const refreshProjectList = React.useCallback(() => {
    ProjectServices.getList(clusterid as string).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project items fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      setData(data.projects as Project[]);
    });
  }, [toast, clusterid]);

  React.useEffect(() => {
    refreshProjectList();
    getProjectMockData();
  }, [refreshProjectList, getProjectMockData]);

  const handlerTechnologyTypeChange = (id: string) => {
    const newTechnologyCheckedStates = { ...technologyCheckedStates };
    newTechnologyCheckedStates[id] = !newTechnologyCheckedStates[id];
    setTechnologyCheckedStates(newTechnologyCheckedStates);
    let technologyNames: string[] = [];
    technologys.forEach((technologyType) => {
      if (newTechnologyCheckedStates[technologyType.name] === true) {
        technologyNames.push(technologyType.name);
      }
    });
    let newTechnologyCheckeName = technologyNames.join(", ");
    if (newTechnologyCheckeName.length > 30) {
      newTechnologyCheckeName = `${newTechnologyCheckeName.slice(0, 30)}...`;
    }
    setTechnologyCheckeName(newTechnologyCheckeName);
  };

  const projectEditHandlerTechnologyTypeAndBusinessTypeChange = (
    business: Business[]
  ) => {
    const allBusiness = projectMockData?.business;
    if (!allBusiness) {
      return;
    }
    let newBusinessCheckedStates: { [key: string]: boolean } = {};
    let newTechnologyCheckedStates: { [key: string]: boolean } = {};
    let newTechnologyTypes: Technology[] = [];
    let businessNames: string[] = [];
    business?.forEach((businessType) => {
      newBusinessCheckedStates[businessType.name] = true;
      businessNames.push(businessType.name);
      newTechnologyTypes = [...newTechnologyTypes, ...businessType.technologys];
    });

    allBusiness?.forEach((businessType) => {
      if (!newBusinessCheckedStates[businessType.name]) {
        newBusinessCheckedStates[businessType.name] = false;
      }
    });

    setBusinessCheckedStates(newBusinessCheckedStates);
    setTechnologys(
      allBusiness.reduce((acc: Technology[], businessType) => {
        if (newBusinessCheckedStates[businessType.name]) {
          acc.push(...businessType.technologys);
        }
        return acc;
      }, [])
    );

    let newBusinessCheckeName = businessNames.join(", ");
    if (newBusinessCheckeName.length > 30) {
      newBusinessCheckeName = `${newBusinessCheckeName.slice(0, 30)}...`;
    }
    setBusinessCheckeName(newBusinessCheckeName);

    let newTechnologyCheckeNameArr: string[] = [];
    newTechnologyTypes.forEach((technologyType) => {
      newTechnologyCheckedStates[technologyType.name] = true;
      newTechnologyCheckeNameArr.push(technologyType.name);
    });
    let newTechnologyCheckeName = newTechnologyCheckeNameArr.join(", ");
    if (newTechnologyCheckeName.length > 30) {
      newTechnologyCheckeName = `${newTechnologyCheckeName.slice(0, 30)}...`;
    }
    setTechnologyCheckedStates(newTechnologyCheckedStates);
    setTechnologyCheckeName(newTechnologyCheckeName);
  };

  const technologyType = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="col-span-3">
            {!technologyCheckeName
              ? "Select Technology Type"
              : technologyCheckeName}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4 overflow-y-auto overflow-auto">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Technology Type</h4>
              <p className="text-sm text-muted-foreground">
                Select the technology type for this project.
              </p>
            </div>
            <div className="grid gap-2">
              {technologys?.map((technologyType) => (
                <div
                  id={technologyType.name}
                  key={technologyType.name}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={
                      technologyCheckedStates[technologyType.name] || false
                    }
                    onClick={() =>
                      handlerTechnologyTypeChange(technologyType.name)
                    }
                    key={technologyType.name}
                    value={technologyType.name}
                  />
                  <Label className="text-sm font-normal" htmlFor="all">
                    {technologyType.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const handlerBusinessTypeChange = (id: string) => {
    const newBusinessCheckedStates = { ...businessCheckedStates };
    newBusinessCheckedStates[id] = !newBusinessCheckedStates[id];
    setBusinessCheckedStates(newBusinessCheckedStates);
    let newTechnologyTypes: Technology[] = [];
    let businessNames: string[] = [];
    projectMockData?.business.forEach((business) => {
      if (newBusinessCheckedStates[business.name] === true) {
        businessNames.push(business.name);
        newTechnologyTypes = [...newTechnologyTypes, ...business.technologys];
      }
    });
    setTechnologys(newTechnologyTypes);
    let newBusinessCheckeName = businessNames.join(", ");
    if (newBusinessCheckeName.length > 30) {
      newBusinessCheckeName = `${newBusinessCheckeName.slice(0, 30)}...`;
    }
    setBusinessCheckeName(newBusinessCheckeName);
  };

  const selectBusinessType = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="col-span-3">
            {!businessCheckeName ? "Select Business Type" : businessCheckeName}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4 overflow-y-auto overflow-auto">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Business Type</h4>
              <p className="text-sm text-muted-foreground">
                Select the business type for this project.
              </p>
            </div>
            <div className="grid gap-2">
              {business?.map((business) => (
                <div
                  id={business.name}
                  key={business.name}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={businessCheckedStates[business.name] || false}
                    onClick={() => handlerBusinessTypeChange(business.name)}
                    key={business.name}
                    value={business.name}
                  />
                  <Label className="text-sm font-normal" htmlFor="all">
                    {business.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const getBusinessTypes = () => {
    let businessTypeArr: Business[] = [];
    business.forEach((businessType) => {
      if (businessCheckedStates[businessType.name] === true) {
        let technologys: Technology[] = [];
        businessType.technologys.forEach((technology) => {
          if (technologyCheckedStates[technology.name] === true) {
            technologys.push(technology);
          }
        });
        businessType.technologys = technologys;
        businessTypeArr.push(businessType);
      }
    });
    return businessTypeArr;
  };

  const clearProject = () => {
    setProjectid("");
    setProjectName("");
    setProjectDescription("");
    setBusinessCheckeName("");
    setTechnologyCheckeName("");
    setBusinessCheckedStates({});
    setTechnologyCheckedStates({});
  };

  const saveProject = () => {
    const projectData: Project = {
      id: projectid,
      name: projectName,
      description: projectDescription,
      cluster_id: clusterid as string,
      state: "",
      business: getBusinessTypes(),
      business_technology: "",
    };
    if (projectData.id === "") {
      projectData.id = "0";
    }
    ProjectServices.save(projectData).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project saveing fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      refreshProjectList();
      let descriptionMsg = "add success";
      if (Number(projectData?.id) > 0) {
        descriptionMsg = "edit success";
      }
      toast({
        title: "project",
        description: descriptionMsg,
      });
    });
  };

  const addProjectComponent = () => {
    return (
      <Dialog open={AddEditProjectOpen} onOpenChange={setAddEditProjectOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => clearProject()}>
            Add New
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>project</DialogTitle>
            <DialogDescription>
              Make changes to Project here. Click save when you are done. Todo
              需要在新建项目的时候增加配额
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => {
                  const regex = /^[A-Za-z0-9-]*$/;
                  if (regex.test(e.target.value)) {
                    setProjectName(e.target.value);
                  }
                }}
                disabled={projectid ? true : false}
                placeholder={projectMockData?.name}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Business</Label>
              {selectBusinessType()}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">technology</Label>
              {technologyType()}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                className="col-span-3"
                id="description"
                placeholder="Type your message here."
                value={projectDescription}
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={saveProject}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const projectDelete = (id: string) => {
    ProjectServices.delete(id).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project delete fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      refreshProjectList();
    });
  };

  const enableProject = (id: string) => {
    ProjectServices.enable(id).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project enable fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      refreshProjectList();
    });
  };

  const disableProject = (id: string) => {
    ProjectServices.enable(id).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project disable fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      refreshProjectList();
    });
  };

  const columns: ColumnDef<Project>[] = [
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
      accessorKey: "cluster_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cluster ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-4">{row.getValue("cluster_id")}</div>
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
      accessorKey: "business_technology",
      header: "Business/Technology",
      cell: ({ row }) => <div>{row.getValue("business_technology")}</div>,
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("state")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => <div>Description</div>,
      cell: ({ row }) => {
        const description = row.getValue("description");
        const truncatedDescription =
          typeof description === "string" && description.length > 30
            ? description.substring(0, 30) + "..."
            : description;
        return (
          <div className="font-medium">{truncatedDescription as string}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const project = row.original;

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
                onClick={() => navigator.clipboard.writeText(project.id)}
              >
                Copy project ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/home/cluster/${clusterid}/project/${project.id}`;
                }}
              >
                Details
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.state === "running"}
                onClick={() => enableProject(project.id)}
              >
                Enable
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.state !== "running"}
                onClick={() => disableProject(project.id)}
              >
                Disable
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  clearProject();
                  setAddEditProjectOpen(true);
                  setProjectid(project.id);
                  setProjectName(project.name);
                  setProjectDescription(project.description);
                  projectEditHandlerTechnologyTypeAndBusinessTypeChange(
                    project.business
                  );
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.state === "running"}
                onClick={() => projectDelete(project.id)}
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
          placeholder="Filter projects..."
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
        {addProjectComponent()}
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
  );
}
