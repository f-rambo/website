"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { App, AppVersion } from "@/types/types";
import { AppstoreService } from "@/services/app/v1alpha1/app";
import { useToast } from "@/components/ui/use-toast";
import { DrawingPinIcon, ActivityLogIcon } from "@radix-ui/react-icons";
import YamlEditor from "@focus-reactive/react-yaml";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GithubIcon, IconMap } from "@/components/icon";
import Image from "next/image";

function MyIcon({ iconName }: { iconName: keyof typeof IconMap }) {
  if (iconName?.includes("https://")) {
    return (
      <Image
        className="h-12 w-12"
        src={iconName}
        alt="icon"
        width={120}
        height={120}
      />
    );
  }
  if (!iconName) {
    return <GithubIcon className="h-12 w-12" />;
  }
  const Icon = IconMap[iconName];
  if (!Icon) {
    return <GithubIcon className="h-12 w-12" />;
  }
  return <Icon className="h-12 w-12" />;
}

export default function AppDetail() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const appid = searchParams.get("appid") as string;
  const appname = searchParams.get("appname") as string;
  const repositorieid = searchParams.get("repositorieid") as string;
  const [app, setApp] = useState<App>();
  const [appVersion, setAppVersion] = useState<AppVersion>();
  const [appVersionIdOrNumber, setAppVersionIdOrNumber] = useState<string>(
    repositorieid
      ? (searchParams.get("appversionnumber") as string)
      : (searchParams.get("versionid") as string)
  );

  const getApp = useCallback(
    async (appid: string, versionid: string) => {
      if (!appid || !versionid) {
        return;
      }
      const res = await AppstoreService.getApp(
        appid as string,
        versionid as string
      );
      if (res instanceof Error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      const app = res as App;
      setApp(app);
      const version = app.versions.find((v) => v.id === versionid);
      if (version) {
        setAppVersion(version);
        return;
      }
      if (app.versions.length > 0) {
        setAppVersion(app.versions[0]);
        return;
      }
      toast({
        title: "Error",
        variant: "destructive",
        description: "No version found",
      });
    },
    [toast]
  );

  const getAppByRepo = useCallback(
    async (
      repositorieid: string,
      appname: string,
      appversionnumber: string
    ) => {
      if (!repositorieid || !appname || !appversionnumber) {
        return;
      }
      const res = await AppstoreService.appRepoAppDetail(
        repositorieid,
        appname,
        appversionnumber
      );
      if (res instanceof Error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      const app = res as App;
      setApp(app);
      const version = app.versions.find((v) => v.version === appversionnumber);
      if (version) {
        setAppVersion(version);
        return;
      }
      if (app.versions.length > 0) {
        setAppVersion(app.versions[0]);
        return;
      }
      toast({
        title: "Error",
        variant: "destructive",
        description: "No version found",
      });
    },
    [toast]
  );

  useEffect(() => {
    if (repositorieid) {
      getAppByRepo(repositorieid, appname, appVersionIdOrNumber);
      return;
    }
    getApp(appid, appVersionIdOrNumber);
    return;
  }, [
    getAppByRepo,
    repositorieid,
    appname,
    getApp,
    appid,
    appVersionIdOrNumber,
  ]);

  return (
    <div className="space-y-4">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              {MyIcon({ iconName: app?.icon as keyof typeof IconMap })}
              <h1 className="text-2xl font-bold">{app?.name}</h1>
            </div>
            <p className="text-gray-600">
              {appVersion?.description || "No description"}
            </p>
            <Tabs className="w-full" defaultValue="app-description">
              <TabsList className="flex gap-4">
                <TabsTrigger value="app-description">
                  App Description
                </TabsTrigger>
                <TabsTrigger value="chart-files">Chart Files</TabsTrigger>
              </TabsList>
              <TabsContent value="app-description">
                <div className="p-4">
                  <YamlEditor text={appVersion?.readme || ""} />
                </div>
              </TabsContent>
              <TabsContent value="chart-files">
                <div className="p-4">
                  <YamlEditor text={appVersion?.config || ""} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Versions</h3>
              <div className="flex items-center mt-2">
                <ActivityLogIcon className="h-6 w-6 mr-3" />
                <Select onValueChange={setAppVersionIdOrNumber}>
                  <SelectTrigger id="version">
                    <SelectValue placeholder={appVersion?.version} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {app?.versions.map((version) => (
                      <SelectItem key={version.id} value={version.version}>
                        {version.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="flex items-center mt-2">
                <ActivityLogIcon className="h-6 w-6 mr-3" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full" variant="outline">
                      Action
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => console.log("deploy")}>
                      Deploy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={app?.app_type_id === "-2"}
                      onClick={() => console.log("Testing")}
                    >
                      Testing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={app?.app_type_id === "-2"}
                      onClick={() => console.log("Delete")}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Test result</h3>
              <div className="flex items-center mt-2">
                <DrawingPinIcon className="h-6 w-6" />
                <p className="ml-2 text-gray-600">{appVersion?.state}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
