import request from "@/utils/request";

export function transactionServices(id) {
  return request({
    url: `/service_transactions/transactions/${id}`,
    method: "get"
  });
}

export function update(data, id) {
  return request({
    url: `/service_transactions/${id}`,
    method: "patch",
    data
  });
}

export function batchUpdate(data) {
  return request({
    url: `/service_transactions/batch`,
    method: "patch",
    data
  });
}

export function destroy(data, id) {
  return request({
    url: `/service_transactions/${id}`,
    method: "delete",
    data
  });
}

export function restore(id) {
  return request({
    url: `/service_transactions/${id}/restore`,
    method: "patch"
  });
}
