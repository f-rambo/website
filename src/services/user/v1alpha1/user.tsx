import { handlerResponse } from "../../common";

const userApi = `/api/backend/user`;

export const UserService = {
  async userInfo() {
    const userUrl = new URL(userApi, window.location.origin);
    const res = await fetch(userUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async getUsers(
    username: string,
    email: string,
    page: number,
    pageSize: number
  ) {
    const getUsersUrl = new URL(userApi + "s", window.location.origin);
    if (username && username.trim() !== "") {
      getUsersUrl.searchParams.append("username", username);
    }
    if (email && email.trim() !== "") {
      getUsersUrl.searchParams.append("email", email);
    }
    getUsersUrl.searchParams.append("page_number", page.toString());
    getUsersUrl.searchParams.append("page_size", pageSize.toString());
    const res = await fetch(getUsersUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
  async saveUser(user: any) {
    const saveUserUrl = new URL(userApi, window.location.origin);
    const res = await fetch(saveUserUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(user),
    });
    return handlerResponse(res);
  },
  async deleteUser(id: string) {
    const deleteUserUrl = new URL(userApi, window.location.origin);
    deleteUserUrl.searchParams.append("id", id);
    const res = await fetch(deleteUserUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
};
