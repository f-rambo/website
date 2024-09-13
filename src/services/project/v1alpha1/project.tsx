import { handlerResponse, jsonToQueryString } from "../../common";

const projectApi = `${process.env.HOST ?? ""}${
  process.env.PORT ?? ""
}/api/backend/project`;

export const ProjectServices = {
  async getList(clusterID: string) {
    const res = await fetch(`${projectApi}/list?cluster_id=${clusterID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getDetail(id: string) {
    const res = await fetch(`${projectApi}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async save(project: any) {
    const res = await fetch(`${projectApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
    return handlerResponse(res);
  },
  async delete(id: string) {
    const res = await fetch(`${projectApi}?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getProjectMockData() {
    const res = await fetch(`${projectApi}/mock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async enable(id: string) {
    const res = await fetch(`${projectApi}/enable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    return handlerResponse(res);
  },
  async disable(id: string) {
    const res = await fetch(`${projectApi}/disable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    return handlerResponse(res);
  },
};
