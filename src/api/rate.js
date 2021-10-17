import request from "@/utils/request";

export function index(data) {
  return request({
    url:
      "/rates" +
      (data && "withTrashed" in data ? "?withTrashed=" + data.withTrashed : ""),
    method: "get"
  });
}

export function store(data) {
  return request({
    url: "/rates",
    method: "post",
    data
  });
}

export function show(id) {
  return request({
    url: `/rates/${id}`,
    method: "get"
  });
}

export function update(data, id) {
  return request({
    url: `/rates/${id}`,
    method: "patch",
    data
  });
}

export function destroy(id) {
  return request({
    url: `/rates/${id}`,
    method: "delete"
  });
}

export function restore(id) {
  return request({
    url: `/rates/${id}/restore`,
    method: "patch"
  });
}
