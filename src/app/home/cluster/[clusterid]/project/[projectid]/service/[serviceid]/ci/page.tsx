"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { ServiceServices } from "@/services/service/v1alpha1/service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PageComponent } from "@/components/pagination";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Ci } from "@/types/types";

export default function ServiceCiPage({
  params,
}: {
  params: { clusterid: string; projectid: string; serviceid: string };
}) {
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(0);
  const [cis, setCis] = React.useState<Ci[]>([]);
  const [version, setVersion] = React.useState("");
  const { toast } = useToast();
  const [service, setService] = React.useState<Service>();

  const getService = React.useCallback(
    (serviceid: string) => {
      ServiceServices.get(serviceid).then((res) => {
        if (res instanceof Error) {
          toast({
            variant: "destructive",
            title: "get service failed",
            description: res.message,
          });
        }
        setService(res as Service);
      });
    },
    [toast]
  );

  const getCIs = React.useCallback(
    (serviceid: string, version: string, page: number, pageSize: number) => {
      ServiceServices.GetServiceCis(serviceid, version, page, pageSize).then(
        (res) => {
          if (res instanceof Error) {
            toast({
              variant: "destructive",
              title: "get service cis failed",
              description: res.message,
            });
          }
          setCis(res.cis);
          setPageCount(Math.ceil(res.total / pageSize));
        }
      );
    },
    [toast]
  );

  React.useEffect(() => {
    getCIs(params.serviceid, version, page, 10);
    getService(params.serviceid);
  }, [getService, getCIs, params.serviceid, version, page]);

  const add = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add New</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogDescription>
              git branch or tag to build and deploy
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex flex-1">
          <Input
            className="bg-white dark:bg-gray-950 max-w-sm mr-3"
            placeholder="Search services..."
            type="search"
          />
        </div>
        {add()}
      </div>

      <Table>
        <TableCaption>A list of your Continuous Integrations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Branch/tag</TableHead>
            <TableHead>Args</TableHead>
            <TableHead>User</TableHead>
            <TableHead>State</TableHead>
            <TableHead>CreateAt</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cis.map((ci) => (
            <TableRow key={ci.id}>
              <TableCell className="font-medium">{ci.id}</TableCell>
              <TableCell>{ci.version}</TableCell>
              <TableCell>
                {!ci.tag ? ci.branch : `${ci.branch}/${ci.tag}`}
              </TableCell>
              <TableCell>{ci.username}</TableCell>
              <TableCell>{ci.args}</TableCell>
              <TableCell>{ci.state}</TableCell>
              <TableCell>{ci.created_at}</TableCell>
              <TableCell className="text-right">
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
                      onClick={() => navigator.clipboard.writeText(ci.id)}
                    >
                      Copy project ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        (window.location.href = `/home/cluster/${params.clusterid}/project/${params.projectid}/service/${ci.id}`)
                      }
                    >
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </Table>
      <div className="mt-3">
        <PageComponent
          totalPages={pageCount}
          pageRange={3}
          onPageChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
