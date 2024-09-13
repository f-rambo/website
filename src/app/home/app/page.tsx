"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontalIcon,
  GithubIcon,
  GitBranchIcon,
  IconMap,
} from "@/components/icon";
import { DrawingPinFilledIcon } from "@radix-ui/react-icons";
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
import { App } from "@/types/types";
import { AppstoreService } from "@/services/app/v1alpha1/app";
import { useToast } from "@/components/ui/use-toast";
import { PageComponent } from "@/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function MyIcon({ iconName }: { iconName: keyof typeof IconMap }) {
  if (iconName.includes("https://")) {
    return (
      <Image
        className="w-8 h-8"
        src={iconName}
        alt="icon"
        width={60}
        height={60}
      />
    );
  }
  if (!iconName) {
    return <GithubIcon className="w-8 h-8" />;
  }
  const Icon = IconMap[iconName];
  if (!Icon) {
    return <GithubIcon className="w-8 h-8" />;
  }
  return <Icon className="w-8 h-8" />;
}

export default function AppPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repositorieid = searchParams.get("repositorieid");
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [apps, setApps] = useState<App[]>([]);
  const [icon, setIcon] = useState("home");
  const [repoApps, setRepoApps] = useState<App[]>([]);
  const pageSize = 9;

  const repoAppList = useCallback(() => {
    AppstoreService.appRepoApps(repositorieid as string).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "app items fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      setRepoApps(data.items as App[]);
    });
  }, [toast, repositorieid]);

  const refreshAppList = useCallback(() => {
    let paramPage = page;
    if (paramPage < 1) {
      paramPage = 1;
    }
    AppstoreService.getList({
      page: paramPage,
      page_size: pageSize,
      name: search,
    }).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "app items fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      setApps(data.items as App[]);
      setPageCount(data.pageCount);
    });
  }, [page, search, toast]);

  useEffect(() => {
    if (!repositorieid || repositorieid === "") {
      refreshAppList();
      return;
    }
    if (repoApps.length === 0) {
      repoAppList();
    }
    let paramPage = page;
    if (paramPage < 1) {
      paramPage = 1;
    }
    let appItems = repoApps;
    appItems.sort((a: App, b: App) => {
      return a.name < b.name ? -1 : 1;
    });
    if (search !== "") {
      paramPage = 1;
      appItems = appItems.filter((app: App) =>
        app.name.includes(search)
      ) as App[];
    }
    let startIndex = (paramPage - 1) * pageSize;
    let endIndex = paramPage * pageSize;
    if (endIndex > appItems.length) {
      endIndex = appItems.length;
    }
    setApps(appItems.slice(startIndex, endIndex));
    setPageCount(Math.ceil(appItems.length / pageSize));
  }, [
    repoAppList,
    refreshAppList,
    page,
    search,
    toast,
    repositorieid,
    repoApps,
  ]);

  const handlePackageFileUpload = () => {
    const fileInput = document.getElementById(
      "package"
    ) as HTMLInputElement | null;

    if (!fileInput || !fileInput.files || fileInput.files.length <= 0) {
      toast({
        title: "upload fail",
        variant: "destructive",
        description: "No file selected",
      });
      return;
    }

    const file = fileInput.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      AppstoreService.uploadAppPackage({
        icon: icon,
        file_name: fileName,
        chunk: base64 as string,
        resume: false,
        finish: false,
      }).then((data) => {
        if (data instanceof Error) {
          toast({
            title: "upload fail",
            variant: "destructive",
            description: data.message,
          });
          return;
        }
        AppstoreService.saveApp(data as App).then((data) => {
          if (data instanceof Error) {
            toast({
              title: "save app fail",
              variant: "destructive",
              description: data.message,
            });
            return;
          }
          refreshAppList();
        });
      });
      toast({
        title: "upload success",
        description: "upload success",
      });
    };
  };

  const appNotfound = (
    <div className="h-24 text-center">
      <span>No results.</span>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))]  flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto flex items-center gap-4">
          <div className="flex-1">
            <Input
              className="bg-white dark:bg-gray-950"
              placeholder="Search apps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New App</DialogTitle>
                <DialogDescription>Upload helm archive *.tgz</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Select onValueChange={setIcon}>
                  <SelectTrigger className="sm:max-w-[425px]">
                    <SelectValue placeholder="Select a icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>icons</SelectLabel>
                      {Object.entries(IconMap).map(([name, IconComponent]) => (
                        <SelectItem key={name} value={name}>
                          <div className="flex items-center">
                            <IconComponent />
                            <span className="ml-3">{name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="package">Package</Label>
                  <Input id="package" type="file" accept=".tgz" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" onClick={handlePackageFileUpload}>
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {apps.length === 0 && appNotfound}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
          {apps.map((app) => (
            <Card key={app.id} className="bg-gray-100/20">
              <CardHeader className="flex flex-row items-center gap-4">
                {MyIcon({ iconName: app.icon as keyof typeof IconMap })}
                <div className="grid gap-1">
                  <CardTitle>{app.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <DrawingPinFilledIcon className="w-4 h-4" />
                    {app.versions && app.versions.length > 0
                      ? app.versions[0].state
                      : ""}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto" size="icon" variant="ghost">
                      <MoreHorizontalIcon className="w-4 h-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        if (!app.versions || app.versions.length === 0) {
                          toast({
                            title: "404",
                            variant: "destructive",
                            description: "app version not found",
                          });
                          return;
                        }
                        let url = `/home/app/detail`;
                        if (repositorieid) {
                          url += `?repositorieid=${repositorieid}&appname=${app.name}&appversionnumber=${app.versions[0].version}`;
                        } else {
                          url += `?appid=${app.id}&versionid=${app.versions[0].id}`;
                        }
                        router.push(url);
                      }}
                    >
                      View App
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={app.app_type_id === "-2"}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent className="grid gap-2">
                <div className="text-sm font-semibold">
                  {app.versions && app.versions.length > 0
                    ? app.versions[0].description.substring(0, 99) + "..."
                    : ""}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <GithubIcon className="w-4 h-4" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {app.update_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranchIcon className="w-4 h-4" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {app.versions && app.versions.length > 0
                        ? app.versions[0].version
                        : ""}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <PageComponent
          totalPages={pageCount}
          pageRange={3}
          onPageChange={(page: number) => setPage(page)}
        />
      </main>
    </div>
  );
}
