import request from "@/utils/request";

export function indexPagination(data) {
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
    url: "/clients/pagination" + queryString,
    method: "get"
  });
}

export function indexStatistics() {
  return request({
    url: `/clients/statistics`,
    method: "get"
  });
}

export function store(data) {
  return request({
    url: "/clients",
    method: "post",
    data
  });
}

export function show(id) {
  return request({
    url: `/clients/${id}`,
    method: "get"
  });
}

export function statistics(id) {
  return request({
    url: `/clients/${id}/statistics`,
    method: "get"
  });
}

export function updateBasicInformation(data, id) {
  return request({
    url: `/clients/${id}/update-basic-information`,
    method: "patch",
    data
  });
}

export function updatePersonalInformation(data, id) {
  return request({
    url: `/clients/${id}/update-personal-information`,
    method: "patch",
    data
  });
}

export function updateContactInformation(data, id) {
  return request({
    url: `/clients/${id}/update-contact-information`,
    method: "patch",
    data
  });
}
