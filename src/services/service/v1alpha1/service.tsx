import { handlerResponse, jsonToQueryString } from "../../common";

const serviceApi = `${process.env.HOST ?? ""}${
  process.env.PORT ?? ""
}/api/backend/service`;

export const ServiceServices = {
  async getList({
    name: name,
    project_id: projectID,
    page: page,
    page_size: pageSize,
  }: {
    project_id: string;
    name: string;
    page: number;
    page_size: number;
  }) {
    const param = jsonToQueryString({
      project_id: projectID,
      name: name,
      page: page,
      page_size: pageSize,
    });
    const res = await fetch(`${serviceApi}/list?${param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async save(service: any) {
    const res = await fetch(`${serviceApi}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });
    return handlerResponse(res);
  },
  async get(id: string) {
    const res = await fetch(`${serviceApi}/get?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async delete(id: string) {
    const res = await fetch(`${serviceApi}/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getWorkflow(serviceid: string, args: string) {
    const res = await fetch(
      `${serviceApi}/workflow?id=${serviceid}&wf_args=${args}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return handlerResponse(res);
  },
  async saveWorkflow(serviceid: string, wfType: string, workflow: any) {
    const res = await fetch(`${serviceApi}/workflow?id=${serviceid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: serviceid,
        wf_type: wfType,
        workflow: workflow,
      }),
    });
    return handlerResponse(res);
  },
  async commitWorklfow(serviceid: string, wfType: string, workflowid: string) {
    const res = await fetch(
      `${serviceApi}/commit?id=${serviceid}&wf_type=${wfType}&wf_id=${workflowid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: serviceid,
          wf_type: wfType,
          workflow_id: workflowid,
        }),
      }
    );
    return handlerResponse(res);
  },
  async GetServiceCis(
    serviceid: string,
    version: string,
    page: number,
    pageSize: number
  ) {
    const param = jsonToQueryString({
      service_id: serviceid,
      version: version,
      page: page,
      page_size: pageSize,
    });
    const res = await fetch(`${serviceApi}/cis?${param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
};
