import request from "@/utils/request";

export function clientProfileLogs(data, id) {
  return request({
    url:
      `/activity_logs/${id}/client-profile` +
      (data && "page" in data ? "?page=" + data.page : ""),
    method: "get"
  });
}

export function clientPaymentLogs(data, id) {
  return request({
    url:
      `/activity_logs/${id}/client-payment` +
      (data && "page" in data ? "?page=" + data.page : ""),
    method: "get"
  });
}

export function clientTransactionLogs(data, id) {
  return request({
    url:
      `/activity_logs/${id}/client-transaction` +
      (data && "page" in data ? "?page=" + data.page : ""),
    method: "get"
  });
}

export function groupProfileLogs(data, id) {
  return request({
    url:
      `/activity_logs/${id}/group-profile` +
      (data && "page" in data ? "?page=" + data.page : ""),
    method: "get"
  });
}

export function groupPaymentLogs(data, id) {
  return request({
    url:
      `/activity_logs/${id}/group-payment` +
      (data && "page" in data ? "?page=" + data.page : ""),
    method: "get"
  });
}

export function groupTransactionLogs(data, id) {
  return request({
    url:
      `/activity_logs/${id}/group-transaction` +
      (data && "page" in data ? "?page=" + data.page : ""),
    method: "get"
  });
}
