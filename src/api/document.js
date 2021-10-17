import request from "@/utils/request";

export function index(data) {
  return request({
    url:
      "/documents" +
      (data && "withTrashed" in data ? "?withTrashed=" + data.withTrashed : ""),
    method: "get"
  });
}

export function store(data) {
  return request({
    url: "/documents",
    method: "post",
    data
  });
}

export function show(id) {
  return request({
    url: `/documents/${id}`,
    method: "get"
  });
}

export function update(data, id) {
  return request({
    url: `/documents/${id}`,
    method: "patch",
    data
  });
}

export function destroy(id) {
  return request({
    url: `/documents/${id}`,
    method: "delete"
  });
}

export function restore(id) {
  return request({
    url: `/documents/${id}/restore`,
    method: "patch"
  });
}
