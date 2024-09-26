import { handlerResponse } from "@/services/common";

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
};
