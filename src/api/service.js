import request from "@/utils/request";

export function index(data) {
  return request({
    url:
      "/services" +
      (data && "withTrashed" in data ? "?withTrashed=" + data.withTrashed : ""),
    method: "get"
  });
}

export function indexWithRates() {
  return request({
    url: "/services/index-with-rates",
    method: "get"
  });
}

export function store(data) {
  return request({
    url: "/services",
    method: "post",
    data
  });
}

export function show(id, data) {
  let queryString = "";

  if (data) {
    let arr = [];

    if ("type" in data) {
      arr.push("?type=" + data.type);
    }

    if ("withTrashed" in data) {
      arr.push("?withTrashed=" + data.withTrashed);
    }

    arr = arr.map((a, i) => {
      if (i != 0) {
        return a.replace("?", "");
      }

      return a;
    });

    queryString = arr.join("&");
  }

  return request({
    url: `/services/${id}` + queryString,
    method: "get"
  });
}

export function update(data, id) {
  return request({
    url: `/services/${id}`,
    method: "patch",
    data
  });
}

export function destroy(id, data) {
  return request({
    url:
      `/services/${id}` + (data && "type" in data ? "?type=" + data.type : ""),
    method: "delete"
  });
}

export function restore(id, data) {
  return request({
    url:
      `/services/${id}/restore` +
      (data && "type" in data ? "?type=" + data.type : ""),
    method: "patch"
  });
}
