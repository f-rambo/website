import { handlerResponse } from "../../common";

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
  async GetCurrentCluster() {
    const res = await fetch(`${clusterApi}/current`, {
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
  async getClusterMockData() {
    const res = await fetch(`${clusterApi}/mock`, {
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
  async deleteNode(clusterId: string, nodeId: string) {
    const res = await fetch(
      `${clusterApi}/node?id=${clusterId}&node_id=${nodeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return handlerResponse(res);
  },
  async setUpCluster(clusterID: string) {
    const res = await fetch(`${clusterApi}/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: clusterID }),
    });
    return handlerResponse(res);
  },
  async uninstallCluster(clusterID: string) {
    const res = await fetch(`${clusterApi}/uninstall?id=${clusterID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async addNode(clusterId: string, nodeid: string) {
    const res = await fetch(`${clusterApi}/node`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: clusterId, node_id: nodeid }),
    });
    return handlerResponse(res);
  },
  async removeNode(clusterID: string, nodeID: string) {
    const res = await fetch(
      `${clusterApi}/node/remove?id=${clusterID}&node_id=${nodeID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return handlerResponse(res);
  },
  async checkClusterConfig(clusterID: string) {
    const res = await fetch(`${clusterApi}/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: clusterID }),
    });
    return handlerResponse(res);
  },
};
