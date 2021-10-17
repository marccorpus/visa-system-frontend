import request from "@/utils/request";

export function indexPaginationOfClient(data, id) {
  let queryString = "";

  if (data) {
    let arr = [];

    if ("page" in data) {
      arr.push("?page=" + data.page);
    }

    if ("search" in data) {
      arr.push("?search=" + data.search);
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
    url: `/transactions/${id}/index-pagination-of-client` + queryString,
    method: "get"
  });
}

export function indexPaginationOfGroup(data, id) {
  let queryString = "";

  if (data) {
    let arr = [];

    if ("page" in data) {
      arr.push("?page=" + data.page);
    }

    if ("search" in data) {
      arr.push("?search=" + data.search);
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
    url: `/transactions/${id}/index-pagination-of-group` + queryString,
    method: "get"
  });
}

export function dashboardStatistics() {
  return request({
    url: "/transactions/dashboard-statistics",
    method: "get"
  });
}

export function dashboardServices(data) {
  let queryString = "";

  if (data) {
    let arr = [];

    if ("page" in data) {
      arr.push("?page=" + data.page);
    }

    if ("q" in data) {
      arr.push("?q=" + data.q);
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
    url: `/transactions/dashboard-services` + queryString,
    method: "get"
  });
}

export function store(data) {
  return request({
    url: "/transactions",
    method: "post",
    data
  });
}

export function additionalServices(data) {
  return request({
    url: "/transactions/additional-services",
    method: "post",
    data
  });
}

export function updateDiscount(data, id) {
  return request({
    url: `/transactions/${id}/update-discount`,
    method: "patch",
    data
  });
}

export function destroy(data, id) {
  return request({
    url: `/transactions/${id}`,
    method: "delete",
    data
  });
}

export function restore(id) {
  return request({
    url: `/transactions/${id}/restore`,
    method: "patch"
  });
}
