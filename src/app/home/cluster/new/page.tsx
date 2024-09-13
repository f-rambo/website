"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ActivityLogIcon, GearIcon, BellIcon } from "@radix-ui/react-icons";
import YamlEditor from "@focus-reactive/react-yaml";
import { ClusterServices } from "@/services/cluster/v1alpha1/cluster";
import { Cluster } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranchIcon } from "@/components/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@nextui-org/react";

export default function ClusterNewPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [serverConfig, setserverConfig] = useState<{}>();
  const [clusterConfig, setClusterConfig] = useState<string>("");
  const [clusterAddons, setClusterAddons] = useState<string>("");
  const [clusterAddonsConfig, setClusterAddonsConfig] = useState<string>("");
  const [cluster, setCluster] = useState<Cluster>();
  const clusterid = useSearchParams().get("clusterid");
  const [checkClusterConfigButton, setCheckClusterConfigButton] =
    useState(false);
  const [startDeployButton, setStartDeployButton] = useState(false);

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
      let nodes = cluster.nodes.map((node) => {
        return {
          id: node.id,
          name: node.name,
          external_ip: node.external_ip,
          user: node.user,
          role: node.role,
        };
      });
      setserverConfig({
        name: cluster?.name,
        nodes: nodes,
      });
      setClusterConfig(cluster?.config);
      setClusterAddons(cluster?.addons);
      setClusterAddonsConfig(cluster?.addons_config);
      setStartDeployButton(true);
    });
  }, [toast]);

  const getClusterData = useCallback(
    (clusteid: string) => {
      ClusterServices.getDetail(clusteid).then((res) => {
        if (res instanceof Error) {
          toast({
            title: "Error",
            description: "Error while fetching cluster data",
            duration: 5000,
            variant: "destructive",
          });
          return;
        }
        const cluster = res as Cluster;
        if (cluster.state === "checked") {
          setStartDeployButton(false);
        } else {
          setStartDeployButton(true);
        }
        setCluster(cluster);
        setClusterConfig(cluster?.config);
        setClusterAddons(cluster?.addons);
        setClusterAddonsConfig(cluster?.addons_config);
        let nodes = cluster.nodes.map((node) => {
          return {
            id: node.id,
            name: node.name,
            external_ip: node.external_ip,
            user: node.user,
            role: node.role,
          };
        });
        setserverConfig({
          id: cluster?.id,
          name: cluster?.name,
          nodes: nodes,
        });
      });
    },
    [toast]
  );

  useEffect(() => {
    if (clusterid) {
      var element = document.getElementById("log");
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
      getClusterData(clusterid);
    } else {
      getClusterMockData();
    }
  }, [toast, clusterid, getClusterData, getClusterMockData]);

  const checkCluster = () => {
    setCheckClusterConfigButton(true);
    toast({
      title: "Checking cluster config....",
      description: "Please wait...",
      duration: 5000,
    });
    let clusterData = serverConfig as Cluster;
    if (clusterid) {
      clusterData.id = clusterid;
    }
    clusterData.config = clusterConfig;
    clusterData.addons = clusterAddons;
    ClusterServices.saveCluster(clusterData).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Error",
          description: "Error while saving cluster data",
          duration: 5000,
          variant: "destructive",
        });
        return;
      }
      const cluster = res as Cluster;
      ClusterServices.checkClusterConfig(cluster.id).then((res) => {
        if (res instanceof Error) {
          toast({
            title: "Error",
            description: "Error while checking cluster config",
            duration: 5000,
            variant: "destructive",
          });
          setCheckClusterConfigButton(false);
          router.push(`/home/cluster/new?clusterid=${cluster.id}`);
          return;
        }
        toast({
          title: "Checked cluster config",
          description: "Cluster config checked successfully",
          duration: 5000,
        });
        setCheckClusterConfigButton(false);
        router.push(`/home/cluster/new?clusterid=${cluster.id}`);
      });
    });
  };

  const startDeploy = () => {
    if (!cluster || !cluster.id || cluster.state !== "checked") {
      toast({
        title: "Error",
        description: "Cluster not ready to deploy",
        duration: 5000,
        variant: "destructive",
      });
      return;
    }
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
        title: "New cluster",
        description: "Deploying the cluster...",
        duration: 5000,
      });
      router.push(`/home/cluster/${cluster?.id}/detail`);
    });
  };

  return (
    <div className="space-y-4">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <GearIcon className="h-12 w-12" />
              <h1 className="text-2xl font-bold">Cluster configure</h1>
            </div>
            <p className="text-gray-600">
              Here configure the server information, cluster configuration,
              cluster plugin.
            </p>
            <Tabs className="w-full" defaultValue="cluster-configuration">
              <TabsList className="flex gap-4">
                <TabsTrigger value="server-configuration">
                  Server configuration
                </TabsTrigger>
                <TabsTrigger value="cluster-configuration">
                  Cluster configuration
                </TabsTrigger>
                <TabsTrigger value="cluster-addons">Cluster addons</TabsTrigger>
                <TabsTrigger value="cluster-addons-config">
                  Cluster addons config
                </TabsTrigger>
              </TabsList>
              <TabsContent value="server-configuration">
                <div className="p-4 overflow-y-auto h-screen">
                  <YamlEditor
                    json={serverConfig}
                    onChange={(e) => {
                      setserverConfig(e.json);
                      e.json && setStartDeployButton(true);
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="cluster-configuration">
                <div className="p-4 overflow-y-auto h-screen">
                  <YamlEditor
                    text={clusterConfig}
                    onChange={(e) => {
                      setClusterConfig(e.text);
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="cluster-addons">
                <div className="p-4 overflow-y-auto h-screen">
                  <YamlEditor
                    text={clusterAddons}
                    onChange={(e) => {
                      setClusterAddons(e.text);
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="cluster-addons-config">
                <div className="p-4 overflow-y-auto h-screen">
                  <YamlEditor
                    text={clusterAddonsConfig}
                    onChange={(e) => {
                      setClusterAddonsConfig(e.text);
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
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
                      disabled={checkClusterConfigButton}
                      onClick={checkCluster}
                    >
                      Check config
                      {checkClusterConfigButton && (
                        <Spinner className="ml-3" size="sm" color="default" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={startDeployButton}
                      onClick={startDeploy}
                    >
                      Start deploy
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Cluster State</h3>
              <div className="flex items-center mt-2">
                <BellIcon className="h-6 w-6 mr-3" />
                <p className="ml-2 text-gray-600">{cluster?.state}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Tools</h3>
              <div className="flex items-center mt-2">
                <GitBranchIcon className="h-6 w-6 mr-3" />
                <p className="ml-2 text-gray-600">Kubespray & Ansible</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Check cluster logs</h3>
              <div id="log" className="overflow-y-auto h-96 text-gray-600">
                <pre>{cluster?.logs}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
