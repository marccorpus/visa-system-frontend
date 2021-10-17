import request from "@/utils/request";

export function index(data) {
  return request({
    url: "/groups",
    method: "get"
  });
}

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
    url: "/groups/pagination" + queryString,
    method: "get"
  });
}

export function indexStatistics() {
  return request({
    url: `/groups/statistics`,
    method: "get"
  });
}

export function store(data) {
  return request({
    url: "/groups",
    method: "post",
    data
  });
}

export function addMembers(data) {
  return request({
    url: "/groups/add-members",
    method: "post",
    data
  });
}

export function removeMember(data) {
  return request({
    url: "/groups/remove-member",
    method: "post",
    data
  });
}

export function show(id) {
  return request({
    url: `/groups/${id}`,
    method: "get"
  });
}

export function statistics(id) {
  return request({
    url: `/groups/${id}/statistics`,
    method: "get"
  });
}

export function members(id) {
  return request({
    url: `/groups/${id}/members`,
    method: "get"
  });
}

export function nonMembers(id) {
  return request({
    url: `/groups/${id}/non-members`,
    method: "get"
  });
}

export function membersPagination(data, id) {
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
    url: `/groups/${id}/members-pagination` + queryString,
    method: "get"
  });
}

export function updateBasicInformation(data, id) {
  return request({
    url: `/groups/${id}/update-basic-information`,
    method: "patch",
    data
  });
}

export function updateContactInformation(data, id) {
  return request({
    url: `/groups/${id}/update-contact-information`,
    method: "patch",
    data
  });
}
