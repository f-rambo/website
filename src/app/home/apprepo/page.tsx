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
import { Repositorie } from "@/types/types";
import { AppstoreService } from "@/services/app/v1alpha1/app";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AppRepoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<Repositorie[]>([]);
  const refreshRepoList = React.useCallback(() => {
    AppstoreService.appRepoList().then((data) => {
      if (data instanceof Error) {
        toast({
          title: "app repositorie items fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      setData(data.items as Repositorie[]);
    });
  }, [toast]);

  React.useEffect(() => {
    refreshRepoList();
  }, [refreshRepoList]);

  const [AddEditRepositorieOpen, setAddEditRepositorieOpen] =
    React.useState(false);
  const [editRepositorie, setEditRepositorie] =
    React.useState<Repositorie | null>(null);

  function AddEditRepositorie() {
    const { toast } = useToast();
    const saveRepositorie = () => {
      if (editRepositorie?.id === "") {
        editRepositorie.id = "0";
      }
      toast({
        title: "app repositorie",
        description: "saving...",
      });
      AppstoreService.saveAppRepo(editRepositorie).then((data) => {
        if (data instanceof Error) {
          toast({
            title: "app repositorie saveing fail",
            variant: "destructive",
            description: data.message,
          });
          return;
        }
        refreshRepoList();
        let descriptionMsg = "add success";
        if (Number(editRepositorie?.id) > 0) {
          descriptionMsg = "edit success";
        }
        toast({
          title: "app repositorie",
          description: descriptionMsg,
        });
      });
    };

    return (
      <Dialog
        open={AddEditRepositorieOpen}
        onOpenChange={setAddEditRepositorieOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setEditRepositorie(null)}>
            Add New
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>repositorie</DialogTitle>
            <DialogDescription>
              Make changes to repositorie here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editRepositorie?.name}
                onChange={(e) => {
                  setEditRepositorie((prevRepositorie) => ({
                    ...prevRepositorie,
                    name: e.target.value,
                    id: prevRepositorie?.id || "",
                    url: prevRepositorie?.url || "",
                    description: prevRepositorie?.description || "",
                  }));
                }}
                placeholder="Bitnami"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                placeholder="https://charts.bitnami.com/bitnami"
                className="col-span-3"
                value={editRepositorie?.url}
                onChange={(e) => {
                  setEditRepositorie((prevRepositorie) => ({
                    ...prevRepositorie,
                    url: e.target.value,
                    id: prevRepositorie?.id || "",
                    name: prevRepositorie?.name || "",
                    description: prevRepositorie?.description || "",
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                className="col-span-3"
                id="description"
                placeholder="Type your message here."
                value={editRepositorie?.description}
                onChange={(e) => {
                  setEditRepositorie((prevRepositorie) => ({
                    ...prevRepositorie,
                    description: e.target.value,
                    id: prevRepositorie?.id || "",
                    name: prevRepositorie?.name || "",
                    url: prevRepositorie?.url || "",
                  }));
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={saveRepositorie}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const appRepoDelete = (id: string) => {
    AppstoreService.appRepoDelete(id).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "app repositorie delete fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      refreshRepoList();
    });
  };

  const columns: ColumnDef<Repositorie>[] = [
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
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => <div>{row.getValue("url")}</div>,
    },
    {
      accessorKey: "description",
      header: () => <div>Description</div>,
      cell: ({ row }) => {
        const description = row.getValue("description");
        const truncatedDescription =
          typeof description === "string" && description.length > 60
            ? description.substring(0, 60) + "..."
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
        const repositorie = row.original;

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
                onClick={() => navigator.clipboard.writeText(repositorie.id)}
              >
                Copy repositorie ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push("/home/app?repositorieid=" + repositorie.id)
                }
              >
                View Apps
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setAddEditRepositorieOpen(true);
                  setEditRepositorie((prevRepositorie) => ({
                    ...prevRepositorie,
                    name: repositorie.name,
                    id: repositorie.id,
                    url: repositorie.url,
                    description: repositorie.description,
                  }));
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => appRepoDelete(repositorie.id)}>
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
          placeholder="Filter repositories..."
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
        {AddEditRepositorie()}
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
