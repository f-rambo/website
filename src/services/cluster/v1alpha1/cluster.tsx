import { handlerResponse } from "@/services/common";
import { ClusterLogsRequest } from "@/types/types";

const clusterApi = `${process.env.HOST ?? ""}${
  process.env.PORT ?? ""
}/api/backend/cluster`;

export const ClusterServices = {
  async getList() {
    const res = await fetch(`${clusterApi}/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getDetail(id: string) {
    const res = await fetch(`${clusterApi}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async saveCluster(data: any) {
    const res = await fetch(`${clusterApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handlerResponse(res);
  },
  async deleteCluster(id: string) {
    const res = await fetch(`${clusterApi}?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getClusterRegion(clusterID: string) {
    const res = await fetch(`${clusterApi}/regions?id=${clusterID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async startCluster(clusterID: string) {
    const res = await fetch(`${clusterApi}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: clusterID }),
    });
    return handlerResponse(res);
  },
  async pollingLogs(data: ClusterLogsRequest) {
    const res = await fetch(`${clusterApi}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handlerResponse(res);
  },
  async getClusterTypes() {
    const res = await fetch(`${clusterApi}/types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getClusterStatuses() {
    const res = await fetch(`${clusterApi}/statuses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getClusterLevels() {
    const res = await fetch(`${clusterApi}/levels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getNodeRoles() {
    const res = await fetch(`${clusterApi}/node/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getNodeStatuses() {
    const res = await fetch(`${clusterApi}/node/statuses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getNodeGroupTypes() {
    const res = await fetch(`${clusterApi}/node/group/types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getResourceTypes() {
    const res = await fetch(`${clusterApi}/resource/types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
};
