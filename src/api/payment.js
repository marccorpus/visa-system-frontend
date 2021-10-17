import request from "@/utils/request";

export function index(id) {
  return request({
    url: `/payments/${id}`,
    method: "get"
  });
}

export function store(data) {
  return request({
    url: "/payments",
    method: "post",
    data
  });
}

export function destroy(data, id) {
  return request({
    url: `/payments/${id}`,
    method: "delete",
    data
  });
}

export function restore(id) {
  return request({
    url: `/payments/${id}/restore`,
    method: "patch"
  });
}
