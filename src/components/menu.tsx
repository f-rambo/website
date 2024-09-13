"use client";
import { ShoppingCartIcon, UsersIcon, PackageIcon } from "@/components/icon";
import {
  LaptopIcon,
  GlobeIcon,
  HandIcon,
  TableIcon,
  TargetIcon,
  Crosshair2Icon,
  RocketIcon,
  DashboardIcon,
  FaceIcon,
} from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BreadCrumb } from "@/types/types";

export const homeMenu = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: "/home",
  },
  {
    title: "Cluster",
    icon: LaptopIcon,
    path: "/home/cluster",
  },
  {
    title: "App Store",
    icon: ShoppingCartIcon,
    path: "/home/app",
  },
  {
    title: "App Repositorie",
    icon: GlobeIcon,
    path: "/home/apprepo",
  },
  {
    title: "Organisation",
    icon: FaceIcon,
    path: "/home/organisation",
  },
  {
    title: "Users",
    icon: UsersIcon,
    path: "/home/user",
  },
  {
    title: "Roles",
    icon: HandIcon,
    path: "/home/role",
  },
];

const clusterMenuPrefix = "/home/cluster/clusterid";

export const clusterMenu = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: clusterMenuPrefix,
  },
  {
    title: "Project",
    icon: TableIcon,
    path: clusterMenuPrefix + "/project",
  },
  {
    title: "Application",
    icon: RocketIcon,
    path: clusterMenuPrefix + "/app",
  },
];

const projectMenuPrefix = "/home/cluster/clusterid/project/projectid";

export const projectMenu = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: projectMenuPrefix,
  },
  {
    title: "Service",
    icon: PackageIcon,
    path: projectMenuPrefix + "/service",
  },
  {
    title: "Application",
    icon: RocketIcon,
    path: projectMenuPrefix + "/app",
  },
];

const serviceMenuPrefix =
  "/home/cluster/clusterid/project/projectid/service/serviceid";

export const serviceMenu = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: serviceMenuPrefix,
  },
  {
    title: "CIntegration",
    icon: Crosshair2Icon,
    path: serviceMenuPrefix + "/ci",
  },
  {
    title: "CDelivery",
    icon: TargetIcon,
    path: serviceMenuPrefix + "/cd",
  },
];

export const breadCrumbCluster = [
  {
    title: "Cluster",
    path: clusterMenuPrefix,
  },
];

export const breadCrumbProject = [
  {
    title: "Cluster",
    path: clusterMenuPrefix,
  },
  {
    title: "Project",
    path: projectMenuPrefix,
  },
];

export const breadCrumbService = [
  {
    title: "Cluster",
    path: clusterMenuPrefix,
  },
  {
    title: "Project",
    path: projectMenuPrefix,
  },
  {
    title: "Service",
    path: serviceMenuPrefix,
  },
];

export const MenuCompent = () => {
  const [activePath, setActivePath] = useState("");
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);
  if (activePath === "") {
    return null;
  }
  const ids = activePath.match(/\d+/g);
  let clusterid = "";
  let projectid = "";
  let serviceid = "";
  const numberArray = ids?.map(Number) ?? [];
  for (let i = 0; i < numberArray.length; i++) {
    if (i === 0) {
      clusterid = ids?.[i] ?? "";
    }
    if (i === 1) {
      projectid = ids?.[i] ?? "";
    }
    if (i === 2) {
      serviceid = ids?.[i] ?? "";
    }
  }
  let menu: { path: string; icon: React.ElementType; title: string }[] = [];
  let breadCrumbs: BreadCrumb[] = [];
  if (numberArray.length === 3) {
    for (let i = 0; i < serviceMenu.length; i++) {
      serviceMenu[i].path = serviceMenu[i].path.replace("clusterid", clusterid);
      serviceMenu[i].path = serviceMenu[i].path.replace("projectid", projectid);
      serviceMenu[i].path = serviceMenu[i].path.replace("serviceid", serviceid);
      const pathLength = serviceMenu[i].path.length;
      const newactivePath = activePath.slice(0, pathLength);
      if (serviceMenu[i].path === newactivePath) {
        menu = serviceMenu;
        breadCrumbs = breadCrumbService;
      }
    }
  }
  if (numberArray.length === 2 && menu.length === 0) {
    for (let i = 0; i < projectMenu.length; i++) {
      projectMenu[i].path = projectMenu[i].path.replace("clusterid", clusterid);
      projectMenu[i].path = projectMenu[i].path.replace("projectid", projectid);
      const pathLength = serviceMenu[i].path.length;
      const newactivePath = activePath.slice(0, pathLength);
      if (projectMenu[i].path === newactivePath) {
        menu = projectMenu;
        breadCrumbs = breadCrumbProject;
      }
    }
  }
  if (numberArray.length === 1 && menu.length === 0) {
    for (let i = 0; i < clusterMenu.length; i++) {
      clusterMenu[i].path = clusterMenu[i].path.replace("clusterid", clusterid);
      const pathLength = serviceMenu[i].path.length;
      const newactivePath = activePath.slice(0, pathLength);
      if (clusterMenu[i].path === newactivePath) {
        menu = clusterMenu;
        breadCrumbs = breadCrumbCluster;
      }
    }
  }
  if (menu.length === 0 || numberArray.length === 0) {
    menu = homeMenu;
  }

  for (let i = 0; i < breadCrumbs.length; i++) {
    breadCrumbs[i].path = breadCrumbs[i].path.replace("clusterid", clusterid);
    breadCrumbs[i].path = breadCrumbs[i].path.replace("projectid", projectid);
    breadCrumbs[i].path = breadCrumbs[i].path.replace("serviceid", serviceid);
  }

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {menu.map((item, index) => {
        const itemPath = item.path;
        const isActive = itemPath === activePath;
        const className = isActive
          ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
          : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";

        return (
          <Link
            href={itemPath}
            key={index}
            className={className}
            onClick={() => setActivePath(itemPath)}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};
