"use client";
import React from "react";

export default function projectPage({
  params,
}: {
  params: { clusterid: string };
}) {
  return <div>clusterid: {params.clusterid} Dashboard</div>;
}
