"use client";
import React from "react";
import { ChildContainerProps } from "@/types/types";
import { Toaster } from "@/components/ui/toaster";
import { NextUIProvider } from "@nextui-org/react";

const Layout = ({ children }: ChildContainerProps) => {
  return (
    <React.Fragment>
      <NextUIProvider>
        <div>{children}</div>
        <Toaster />
      </NextUIProvider>
    </React.Fragment>
  );
};

export default Layout;
