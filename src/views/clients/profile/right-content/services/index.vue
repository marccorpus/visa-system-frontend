<template>
  <div id="client-profile-visa-page-services-expand">
    <el-card :body-style="bodyStyle" shadow="never" class="header-card">
      <el-row>
        <el-col :span="12">
          Bulk Action:
          <el-select
            v-model="selectedStatus"
            :disabled="bulkActionDisabled"
            placeholder="Select"
            size="mini"
          >
            <el-option
              v-for="status in statuses"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            >
            </el-option>
          </el-select>
          <el-button
            :disabled="bulkActionDisabled"
            type="primary"
            size="mini"
            icon="el-icon-check"
            class="apply-btn"
            @click="bulkAction"
            >Apply</el-button
          >
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            class="add-service-btn"
            @click="modal('Add Service', null)"
            >Add Service</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card :body-style="bodyStyle" shadow="never" class="table-card">
      <el-table
        :data="transactionServices"
        v-loading="loading"
        show-summary
        :summary-method="getSummaries"
        :header-cell-style="headerCellStyle"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
        ref="transaction-services-table"
        class="transaction-services-table"
      >
        <el-table-column type="selection" width="55" :selectable="selectable">
        </el-table-column>
        <el-table-column label="Date" width="130">
          <template slot-scope="scope">
            {{ humanReadableDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Service">
          <template slot-scope="scope">
            <span class="service-name">
              {{ scope.row.service.name }}
              <template v-if="scope.row.deleted_at">
                <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content">
                    Cancelled by:
                    {{
                      `${scope.row.deleted_by.first_name} ${scope.row.deleted_by.last_name}`
                    }}
                    <br />
                    Reason: {{ scope.row.deletion_reason }}
                    <br />
                    Date: {{ humanReadableDate(scope.row.deleted_at) }}
                  </div>
                  <i class="el-icon-warning-outline icon-info"></i>
                </el-tooltip>
              </template>
            </span>
            <span class="parent-service-name"
              >[{{ scope.row.service.parent_service.name }}]</span
            >
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="!scope.row.deleted_at"
              :type="getStatusTagType(scope.row.status)"
              size="mini"
              effect="dark"
              class="status-tag"
              >{{ scope.row.status }}</el-tag
            >
            <el-tag
              v-else
              type="info"
              size="mini"
              effect="dark"
              class="status-tag"
              >Cancelled</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="Service Cost" align="center" width="150">
          <template slot-scope="scope">{{
            scope.row.deleted_at
              ? "0.00"
              : serviceCost(scope.row.cost, scope.row.under, scope.row.charge)
          }}</template>
        </el-table-column>
        <el-table-column align="center" width="80">
          <template slot-scope="scope">
            <template v-if="!scope.row.deleted_at">
              <el-tooltip
                class="item"
                effect="dark"
                content="Edit Status"
                placement="top"
              >
                <i
                  class="el-icon-edit icon-button"
                  @click="modal('Edit Status', scope.row)"
                ></i>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Cancel Service"
                placement="top"
              >
                <i
                  class="el-icon-circle-close icon-button icon-cancel"
                  @click="modal('Cancel Service', scope.row)"
                ></i>
              </el-tooltip>
            </template>

            <template v-else>
              <el-tooltip
                class="item"
                effect="dark"
                content="Restore Service"
                placement="top"
              >
                <i
                  class="el-icon-refresh-left icon-button icon-restore"
                  @click="restoreService(scope.row)"
                ></i>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :width="dialogWidth"
      :top="dialogTop"
      :visible.sync="dialog.visibility"
      :title="dialog.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <component
        :is="dialog.component"
        :selected-service-transaction="selectedServiceTransaction"
        :transaction="transaction"
        @toggle-dialog="toggleDialog"
        @additional-services="additionalServices"
        @edit-status="editStatus"
        @cancel-service="cancelService"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import {
  transactionServices,
  update,
  batchUpdate,
  destroy,
  restore
} from "@/api/service_transaction";
import { additionalServices } from "@/api/transaction";
import { humanReadableDate, moneyFormat } from "@/utils/index";
import AddService from "./add-service.vue";
import EditStatus from "./edit-status.vue";
import CancelService from "./cancel-service.vue";

export default {
  name: "ClientsServicesExpand",
  props: ["transaction"],
  data() {
    return {
      loading: false,
      transactionServices: [],

      selectedServiceTransaction: null,
      dialog: {
        visibility: false,
        title: null,
        component: null
      },

      statuses: [
        { id: 1, label: "Mark as Pending", value: "Pending" },
        { id: 2, label: "Mark as On Process", value: "On Process" },
        { id: 3, label: "Mark as Completed", value: "Completed" },
        { id: 4, label: "Mark as Released", value: "Released" }
      ],
      selectedStatus: "Pending",
      form: {
        transaction_services: []
      }
    };
  },
  computed: {
    bodyStyle() {
      return { padding: "0px" };
    },
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#f5f7fa" };
    },
    bulkActionDisabled() {
      return this.form.transaction_services.length == 0;
    },
    dialogWidth() {
      if (this.dialog.component == "AddService") {
        return "60%";
      }

      return "40%";
    },
    dialogTop() {
      if (this.dialog.component == "AddService") {
        return "4vh";
      }

      return "15vh";
    }
  },
  methods: {
    getTransactionServices(id) {
      this.loading = true;

      transactionServices(id)
        .then(response => {
          this.transactionServices = response.data.data.transaction_services;

          this.loading = false;
        })
        .catch(() => {});
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.deleted_at) {
        return "danger-row";
      }

      return "";
    },
    humanReadableDate(val) {
      return humanReadableDate(val);
    },
    moneyFormat(val) {
      return val ? moneyFormat(parseFloat(val).toFixed(2)) : "0.00";
    },
    serviceCost(cost, under, charge) {
      return this.moneyFormat(
        parseFloat(cost) + parseFloat(under) + parseFloat(charge)
      );
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      sums[0] = "";
      sums[1] = "Total Service Cost";
      sums[2] = "";
      sums[3] = "";
      sums[5] = "";

      columns.forEach((column, index) => {
        if (index == 4) {
          let totalServiceCost = 0;

          data.forEach(d => {
            if (!d.deleted_at) {
              const serviceCost =
                parseFloat(d.cost.split(",").join("")) +
                parseFloat(d.under.split(",").join("")) +
                parseFloat(d.charge.split(",").join(""));

              totalServiceCost += serviceCost;
            }
          });
          sums[index] = this.moneyFormat(totalServiceCost);
        }
      });

      return sums;
    },
    getStatusTagType(status) {
      if (status == "Pending") {
        return "danger";
      } else if (status == "On Process") {
        return "warning";
      } else if (status == "Completed") {
        return "";
      } else if (status == "Released") {
        return "success";
      }
    },
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    },
    toggleDialog({ visibility, title, component }) {
      if (!visibility) {
        this.dialog.visibility = visibility;

        setTimeout(() => {
          this.dialog.title = title;
          this.dialog.component = component;
        }, 500);
      } else {
        this.dialog = {
          visibility,
          title,
          component
        };
      }
    },
    modal(name, data) {
      this.selectedServiceTransaction = data;

      this.toggleDialog({
        visibility: true,
        title: name,
        component: name.split(" ").join("")
      });
    },
    cancelService(data) {
      destroy(data, data.id)
        .then(response => {
          this.toggleDialog({
            visibility: false,
            title: null,
            component: null
          });

          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.getTransactionServices(this.transaction.id);
          this.$emit("get-transactions");
          this.$emit("get-statistics");
        })
        .catch(error => {});
    },
    restoreService(data) {
      this.$confirm(
        `Are you sure you want to restore service "[${data.service.parent_service.name}] ${data.service.name}"?`,
        "Restore Service",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          restore(data.id)
            .then(response => {
              this.showNotification({
                title: "Success",
                message: response.data.message,
                type: "success"
              });

              this.getTransactionServices(this.transaction.id);
              this.$emit("get-transactions");
              this.$emit("get-statistics");
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    editStatus(data) {
      update(data, data.id)
        .then(response => {
          this.toggleDialog({
            visibility: false,
            title: null,
            component: null
          });

          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.getTransactionServices(this.transaction.id);
          this.$emit("get-transactions");
          this.$emit("get-statistics");
        })
        .catch(error => {});
    },
    selectable(row, index) {
      return !row.deleted_at;
    },
    handleSelectionChange(val) {
      this.form.transaction_services = val.map(v => {
        return {
          id: v.id
        };
      });
    },
    resetBulkAction() {
      this.selectedStatus = "Pending";
      this.form = {
        transaction_services: []
      };
      this.$refs["transaction-services-table"].clearSelection();
    },
    bulkAction() {
      const selectedStatus = this.selectedStatus;
      const transactionServices = this.form.transaction_services;

      this.$confirm(
        `You are about to mark ${transactionServices.length} service${
          transactionServices.length > 1 ? "s" : ""
        } as "${selectedStatus}". Are you sure you want to proceed?`,
        "Bulk Action",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          const temp = [...transactionServices];

          this.form.transaction_services = temp.map(s => {
            s["status"] = selectedStatus;

            return s;
          });

          this.batchUpdate(this.form);
        })
        .catch(() => {
          this.resetBulkAction();
        });
    },
    batchUpdate(data) {
      batchUpdate(data)
        .then(response => {
          this.toggleDialog({
            visibility: false,
            title: null,
            component: null
          });

          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.resetBulkAction();

          this.getTransactionServices(this.transaction.id);
          this.$emit("get-transactions");
          this.$emit("get-statistics");
        })
        .catch(error => {});
    },
    additionalServices(data) {
      additionalServices(data)
        .then(response => {
          this.toggleDialog({
            visibility: false,
            title: null,
            component: null
          });

          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.getTransactionServices(this.transaction.id);
          this.$emit("get-transactions");
          this.$emit("get-statistics");
        })
        .catch(error => {});
    }
  },
  components: {
    AddService,
    EditStatus,
    CancelService
  },
  created() {
    this.getTransactionServices(this.transaction.id);
  }
};
</script>

<style lang="scss">
#client-profile-visa-page-services-expand .el-table__footer-wrapper tbody td {
  color: #303133 !important;
  font-weight: bold !important;
}
</style>
<style lang="scss" scoped>
#client-profile-visa-page-services-expand {
  margin: 15px 0;

  .header-card {
    border: none;

    .apply-btn {
      margin-left: 5px;
    }

    button.add-service-btn {
      float: right;
    }
  }

  .table-card {
    border: none;
    margin-top: 20px;

    .transaction-services-table {
      font-size: 12px;

      .service-name,
      .parent-service-name {
        display: block;
      }
      .parent-service-name {
        font-size: 11px;
      }

      .status-tag {
        font-size: 10px;
      }

      .icon-button {
        color: #1d8ce0;
        font-size: 15px;
        cursor: pointer;
        margin: 0 5px;
      }
      .icon-cancel {
        color: #f56c6c;
      }
      .icon-restore {
        color: #909399;
      }
      .icon-info {
        color: #1d8ce0;
        font-size: 15px;
      }
    }
  }
}
</style>
