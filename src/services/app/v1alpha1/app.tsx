import { handlerResponse, jsonToQueryString } from "../../common";

const appApi = `${process.env.HOST ?? ""}${
  process.env.PORT ?? ""
}/api/backend/app`;

interface FileUploadRequest {
  icon: string;
  file_name: string;
  chunk: string;
  resume: boolean;
  finish: boolean;
}

export const AppstoreService = {
  async ping() {
    const res = await fetch(`${appApi}/ping`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getList(appReq: any) {
    const cleanedAppReq = Object.fromEntries(
      Object.entries(appReq).filter(
        ([_, value]) =>
          value !== null && value !== undefined && value !== "" && value !== 0
      )
    );
    const queryString = jsonToQueryString(cleanedAppReq);
    const res = await fetch(`${appApi}/list?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async uploadAppPackage(uploadRequest: FileUploadRequest) {
    const res = await fetch(`${appApi}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(uploadRequest),
    });
    return handlerResponse(res);
  },
  async createAppType(appName: string) {
    const appType = { name: appName };
    const res = await fetch(`${appApi}/type`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(appType),
    });
    return handlerResponse(res);
  },
  async getAppTypeList() {
    const res = await fetch(`${appApi}/type/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async deleteAppType(id: string) {
    const res = await fetch(`${appApi}/type?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async saveApp(app: any) {
    const res = await fetch(`${appApi}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(app),
    });
    return handlerResponse(res);
  },
  async getApp(id: string, versionId: string) {
    const res = await fetch(`${appApi}?id=${id}&version_id=${versionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  getAppVersionState(state: string) {
    switch (state) {
      case "tested":
        return "success";

      case "untested":
        return "warning";

      case "test_failed":
        return "danger";

      default:
        return "warning";
    }
  },
  getAppVersionStateIcon(state: string) {
    switch (state) {
      case "tested":
        return "pi pi-check";

      case "untested":
        return "pi pi-exclamation-triangle";

      case "test_failed":
        return "pi pi-times";

      default:
        return "pi pi-exclamation-triangle";
    }
  },
  async deleteApp(id: string, versionId: string) {
    const res = await fetch(`${appApi}?id=${id}&version_id=${versionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async appTest(appid: string, versionId: string) {
    const appVersionID = { app_id: appid, version_id: versionId };
    const res = await fetch(`${appApi}/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(appVersionID),
    });
    return handlerResponse(res);
  },
  async getDeployApp(id: string) {
    const res = await fetch(`${appApi}/deploy?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async appRepoList() {
    const res = await fetch(`${appApi}/repo/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async appRepoDelete(id: string) {
    const res = await fetch(`${appApi}/repo?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async appRepoApps(id: string) {
    const res = await fetch(`${appApi}/repo/apps?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async appRepoAppDetail(id: string, appname: string, version: string) {
    const res = await fetch(
      `${appApi}/repo/app/detail?id=${id}&app_name=${appname}&version=${version}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return handlerResponse(res);
  },
  async saveAppRepo(appRepo: any) {
    const res = await fetch(`${appApi}/repo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(appRepo),
    });
    return handlerResponse(res);
  },
  async getAppDeploydDetail(id: string) {
    const res = await fetch(`${appApi}/deploy?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getAppDeploydResource(id: string) {
    const res = await fetch(`${appApi}/deploy/resources?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handlerResponse(res);
  },
  async deployApp(appDeploy: any) {
    const res = await fetch(`${appApi}/deploy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appDeploy),
    });
    return handlerResponse(res);
  },
  async stopApp(appDeployId: string) {
    const appDeployBody = { id: appDeployId };
    const res = await fetch(`${appApi}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appDeployBody),
    });
    return handlerResponse(res);
  },
};
