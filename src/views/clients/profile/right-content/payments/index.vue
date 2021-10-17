<template>
  <div id="client-profile-visa-page-payments-expand">
    <el-card :body-style="bodyStyle" shadow="never" class="header-card">
      <el-row>
        <el-col :span="24">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            class="create-btn"
            @click="modal('Create Payment', null)"
            >Create Payment</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card :body-style="bodyStyle" shadow="never" class="table-card">
      <el-table
        :data="payments"
        v-loading="loading"
        show-summary
        :summary-method="getSummaries"
        :header-cell-style="headerCellStyle"
        :row-class-name="tableRowClassName"
        class="payments-table"
      >
        <el-table-column label="Date" width="130">
          <template slot-scope="scope">
            {{ humanReadableDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Processed By">
          <template slot-scope="scope">
            <div class="user-block">
              <avataaars
                class="user-avatar"
                :circleColor="scope.row.created_by.avatar_circle_color"
                :topType="scope.row.created_by.avatar_top_type"
                :topColor="scope.row.created_by.avatar_top_color"
                :hairColor="scope.row.created_by.avatar_hair_color"
                :accessoriesType="scope.row.created_by.avatar_accessories_type"
                :eyebrowType="scope.row.created_by.avatar_eyebrow_type"
                :eyeType="scope.row.created_by.avatar_eye_type"
                :facialHairType="scope.row.created_by.avatar_facial_hair_type"
                :facialHairColor="scope.row.created_by.avatar_facial_hair_color"
                :mouthType="scope.row.created_by.avatar_mouth_type"
                :skinColor="scope.row.created_by.avatar_skin_color"
                :clotheType="scope.row.created_by.avatar_clothes_type"
                :clotheColor="scope.row.created_by.avatar_clothes_color"
                :graphicType="scope.row.created_by.avatar_graphic_type"
              />
              <span class="user-name">{{
                scope.row.created_by.first_name +
                  " " +
                  scope.row.created_by.last_name
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Note">
          <template slot-scope="scope">
            {{ scope.row.note || "No note available." }}
          </template>
        </el-table-column>
        <el-table-column label="Amount Paid" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.deleted_at ? "0.00" : moneyFormat(scope.row.amount) }}

            <template v-if="scope.row.deleted_at">
              <el-tooltip class="item" effect="dark" placement="top">
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
          </template>
        </el-table-column>
        <el-table-column align="center" width="80">
          <template slot-scope="scope">
            <el-tooltip
              v-if="!scope.row.deleted_at"
              class="item"
              effect="dark"
              content="Cancel Payment"
              placement="top"
            >
              <i
                class="el-icon-circle-close icon-button icon-cancel"
                @click="modal('Cancel Payment', scope.row)"
              ></i>
            </el-tooltip>

            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="Restore Payment"
              placement="top"
            >
              <i
                class="el-icon-refresh-left icon-button icon-restore"
                @click="restorePayment(scope.row)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      width="40%"
      :visible.sync="dialog.visibility"
      :title="dialog.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <component
        :is="dialog.component"
        :transaction-id="transaction.id"
        :selected-payment="selectedPayment"
        @toggle-dialog="toggleDialog"
        @create-payment="createPayment"
        @cancel-payment="cancelPayment"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import Avataaars from "@/components/Avataaars";
import { humanReadableDate, moneyFormat } from "@/utils/index";
import { index, store, destroy, restore } from "@/api/payment";
import CreatePayment from "./create-payment.vue";
import CancelPayment from "./cancel-payment.vue";

export default {
  name: "ClientsPaymentsExpand",
  props: ["transaction"],
  data() {
    return {
      loading: false,
      payments: [],

      selectedPayment: null,
      dialog: {
        visibility: false,
        title: null,
        component: null
      }
    };
  },
  computed: {
    bodyStyle() {
      return { padding: "0px" };
    },
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#f5f7fa" };
    }
  },
  methods: {
    getPayments(id) {
      this.loading = true;

      index(id)
        .then(response => {
          this.payments = response.data.data.payments;

          this.loading = false;
        })
        .catch(() => {});
    },
    humanReadableDate(val) {
      return humanReadableDate(val);
    },
    moneyFormat(val) {
      return val ? moneyFormat(parseFloat(val).toFixed(2)) : "0.00";
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      sums[0] = "Total Amount Paid";
      sums[1] = "";
      sums[2] = "";
      sums[4] = "";

      columns.forEach((column, index) => {
        if (index == 3) {
          let totalAmountPaid = 0;

          data.forEach(d => {
            if (!d.deleted_at) {
              const amountPaid = parseFloat(d.amount.split(",").join(""));

              totalAmountPaid += amountPaid;
            }
          });

          sums[index] = this.moneyFormat(totalAmountPaid);
        }
      });

      return sums;
    },
    toggleDialog({ visibility, title, component }) {
      this.dialog = {
        visibility,
        title,
        component
      };
    },
    modal(name, data) {
      this.selectedPayment = data;

      this.toggleDialog({
        visibility: true,
        title: name,
        component: name.split(" ").join("")
      });
    },
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    },
    createPayment(data) {
      store(data)
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

          this.getPayments(this.transaction.id);
          this.$emit("get-transactions");
          this.$emit("get-statistics");
        })
        .catch(error => {});
    },
    cancelPayment(data) {
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

          this.getPayments(this.transaction.id);
          this.$emit("get-transactions");
          this.$emit("get-statistics");
        })
        .catch(error => {});
    },
    restorePayment(data) {
      this.$confirm(
        `Are you sure you want to restore payment "${this.moneyFormat(
          data.amount
        )}"?`,
        "Restore Payment",
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

              this.getPayments(this.transaction.id);
              this.$emit("get-transactions");
              this.$emit("get-statistics");
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.deleted_at) {
        return "danger-row";
      }

      return "";
    }
  },
  components: {
    Avataaars,
    CreatePayment,
    CancelPayment
  },
  created() {
    this.getPayments(this.transaction.id);
  }
};
</script>

<style lang="scss">
#client-profile-visa-page-payments-expand .el-table__footer-wrapper tbody td {
  color: #303133 !important;
  font-weight: bold !important;
}
</style>
<style lang="scss" scoped>
#client-profile-visa-page-payments-expand {
  margin: 15px 0;

  .header-card {
    border: none;

    button.create-btn {
      float: right;
    }
  }

  .table-card {
    border: none;
    margin-top: 20px;

    .payments-table {
      font-size: 12px;

      .icon-button {
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

      .user-block {
        .user-name {
          display: block;
          margin-left: 30px;
          font-size: 11px;
          line-height: 2.8;
        }

        .user-avatar {
          border-radius: 10px;
          height: 28px;
          width: 28px;
          float: left;
        }
      }
    }
  }
}
</style>
