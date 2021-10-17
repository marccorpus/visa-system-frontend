import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data
  });
}

export function getInfo(token) {
  return request({
    url: "/auth/user",
    method: "get",
    params: { token }
  });
}

export function logout() {
  return request({
    url: "/auth/logout",
    method: "post"
  });
}

export function forgotPassword(data) {
  return request({
    url: "/auth/forgot-password",
    method: "post",
    data
  });
}

export function resetPassword(data) {
  return request({
    url: "/auth/reset-password",
    method: "post",
    data
  });
}

export function index(data) {
  return request({
    url:
      "/users" +
      (data && "withTrashed" in data ? "?withTrashed=" + data.withTrashed : ""),
    method: "get"
  });
}

export function store(data) {
  return request({
    url: "/users",
    method: "post",
    data
  });
}

export function show(id, data) {
  return request({
    url:
      `/users/${id}` +
      (data && "withTrashed" in data ? "?withTrashed=" + data.withTrashed : ""),
    method: "get"
  });
}

export function update(data, id) {
  return request({
    url: `/users/${id}`,
    method: "patch",
    data
  });
}

export function changePassword(data, id) {
  return request({
    url: `/users/${id}/change-password`,
    method: "patch",
    data
  });
}

export function customizeAvatar(data, id) {
  return request({
    url: `/users/${id}/customize-avatar`,
    method: "patch",
    data
  });
}

export function destroy(id) {
  return request({
    url: `/users/${id}`,
    method: "delete"
  });
}

export function restore(id) {
  return request({
    url: `/users/${id}/restore`,
    method: "patch"
  });
}
