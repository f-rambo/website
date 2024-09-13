"use client";
import React, { useState, useEffect } from "react";
import {
  homeMenu,
  projectMenu,
  clusterMenu,
  serviceMenu,
  breadCrumbCluster,
  breadCrumbProject,
  breadCrumbService,
} from "./menu";
import { BreadCrumb } from "@/types/types";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const BreadcrumbComponent = () => {
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

  let lastTwoBreadCrumbs: BreadCrumb[] = [];
  let otherBreadCrumbs: BreadCrumb[] = [];
  if (breadCrumbs) {
    if (breadCrumbs.length > 2) {
      lastTwoBreadCrumbs = breadCrumbs.slice(-2);
      otherBreadCrumbs = breadCrumbs.slice(0, -2);
    } else {
      lastTwoBreadCrumbs = breadCrumbs;
    }
  }

  const otherBreadCrumbsComponent = (breadCrumbs: BreadCrumb[]) => {
    if (breadCrumbs.length === 0) {
      return null;
    }
    return (
      <React.Fragment>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {breadCrumbs.map((breadCrumb) => (
                <DropdownMenuItem
                  key={breadCrumb.title}
                  onClick={() => (window.location.href = breadCrumb.path)}
                >
                  {breadCrumb.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </React.Fragment>
    );
  };
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {otherBreadCrumbsComponent(otherBreadCrumbs)}
        {lastTwoBreadCrumbs.map((breadCrumb) => (
          <React.Fragment key={breadCrumb.title}>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={breadCrumb.title}>
              <BreadcrumbLink href={breadCrumb.path}>
                {breadCrumb.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
