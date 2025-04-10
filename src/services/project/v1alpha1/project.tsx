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
};
