<template>
  <div id="client-profile-visa-page">
    <el-card :body-style="bodyStyle" shadow="never" class="header-card">
      <el-row>
        <el-col :span="1">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="refresh"
          ></el-button>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-input
            size="mini"
            placeholder="Search by Tracking (Press Enter)"
            prefix-icon="el-icon-search"
            v-model="search"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </el-col>
        <el-col :span="6" :offset="10">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            class="create-btn"
            @click="
              $router.push({ name: 'ClientCreateTransaction', params: { id } })
            "
            >Create New Transaction</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card :body-style="bodyStyle" shadow="never" class="table-card">
      <el-table
        :data="transactions"
        :header-cell-style="headerCellStyle"
        :row-style="rowStyle"
        :row-class-name="tableRowClassName"
        v-loading="transactionsTableLoading"
        class="transactions-table"
        ref="transactions-table"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <component
              :is="scope.row.component"
              :transaction="scope.row"
              @get-transactions="getTransactions"
              @get-statistics="$emit('get-statistics')"
            />
          </template>
        </el-table-column>
        <el-table-column label="Date" width="130">
          <template slot-scope="scope">{{
            humanReadableDate(scope.row.created_at)
          }}</template>
        </el-table-column>
        <el-table-column label="Tracking">
          <template slot-scope="scope">
            <div class="tracking-block">
              <span class="tracking">
                {{ scope.row.tracking }}
                <template v-if="scope.row.deleted_at">
                  <el-tooltip class="item" effect="dark" placement="bottom">
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
              <span class="number-of-services"
                >No. of Services:
                {{ scope.row.service_transactions_count }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Total Service Cost" align="center">
          <template slot-scope="scope">
            {{ moneyFormat(scope.row.total_service_cost) }}
          </template>
        </el-table-column>
        <el-table-column label="Total Completed Service Cost" align="center">
          <template slot-scope="scope">
            {{ moneyFormat(scope.row.total_completed_service_cost) }}
          </template>
        </el-table-column>
        <el-table-column label="Discount" align="center">
          <template slot-scope="scope">{{
            scope.row.deleted_at ? "0.00" : moneyFormat(scope.row.discount)
          }}</template>
        </el-table-column>
        <el-table-column label="Total Amount Paid" align="center">
          <template slot-scope="scope">
            {{ moneyFormat(scope.row.payments_sum_amount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="80">
          <template slot-scope="scope">
            <template v-if="!scope.row.deleted_at">
              <el-tooltip
                class="item"
                effect="dark"
                content="View Services"
                placement="top"
              >
                <i
                  class="el-icon-setting icon-button"
                  @click="toggleRow(scope.row, 'ClientsServicesExpand')"
                ></i>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="View Payments"
                placement="top"
              >
                <i
                  class="el-icon-money icon-button"
                  @click="toggleRow(scope.row, 'ClientsPaymentsExpand')"
                ></i>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Edit Discount"
                placement="bottom"
              >
                <i
                  class="el-icon-edit icon-button"
                  @click="modal('Edit Discount', scope.row)"
                ></i>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Cancel Transaction"
                placement="bottom"
              >
                <i
                  class="el-icon-circle-close icon-button icon-cancel"
                  @click="modal('Cancel Transaction', scope.row)"
                ></i>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip
                class="item"
                effect="dark"
                content="Restore Transaction"
                placement="bottom"
              >
                <i
                  class="el-icon-refresh-left icon-button icon-restore"
                  @click="restoreTransaction(scope.row)"
                ></i>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <center>
      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="total"
        @current-change="setPage"
        :current-page.sync="page"
        :page-size="10"
      >
      </el-pagination>
    </center>

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
        :selected-transaction="selectedTransaction"
        @toggle-dialog="toggleDialog"
        @edit-discount="editDiscount"
        @cancel-transaction="cancelTransaction"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import { humanReadableDate, moneyFormat } from "@/utils/index";
import {
  indexPaginationOfClient as _transactionsIndexPaginationOfClient,
  updateDiscount as _transactionsUpdateDiscount,
  destroy as _transactionsDestroy,
  restore as _transactionsRestore
} from "@/api/transaction";

import EditDiscount from "./edit-discount.vue";
import CancelTransaction from "./cancel-transaction.vue";

import ClientsServicesExpand from "./services/index.vue";
import ClientsPaymentsExpand from "./payments/index.vue";

export default {
  name: "ClientsVisa",
  props: ["id", "tabClicked"],
  data() {
    return {
      search: "",

      total: 0,
      page: 1,

      transactionsTableLoading: false,
      transactions: [],

      selectedTransaction: null,
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
      return { color: "#303133", backgroundColor: "#FBF3D0" };
    },
    rowStyle() {
      return { backgroundColor: "#FEFCF3" };
    }
  },
  watch: {
    tabClicked(val) {
      if (val == "Visa") {
        this.refresh();

        this.$emit("get-statistics");
      }
    }
  },
  methods: {
    getTransactions() {
      const data = {
        page: this.page
      };

      const search = this.search.trim();
      if (search.length > 0) {
        data["search"] = search;
      }

      this.transactionsTableLoading = true;

      _transactionsIndexPaginationOfClient(data, this.id)
        .then(response => {
          const { total, data } = response.data.data.transactions;

          this.total = total;
          this.transactions = data;

          this.transactionsTableLoading = false;
        })
        .catch(() => {});
    },
    scrollToTop(top) {
      window.scrollTo({ top, behavior: "smooth" });
    },
    setPage(val) {
      this.page = val;

      const offsetTop = this.$refs["transactions-table"].$el.offsetTop;
      this.scrollToTop(offsetTop);

      this.getTransactions();
    },
    refresh() {
      this.search = "";

      this.page = 1;

      this.getTransactions();
    },
    handleSearch() {
      this.page = 1;

      this.getTransactions();
    },
    humanReadableDate(val) {
      return humanReadableDate(val);
    },
    moneyFormat(val) {
      return val ? moneyFormat(val) : "0.00";
    },
    modal(name, data) {
      this.selectedTransaction = data;

      this.toggleDialog({
        visibility: true,
        title: name,
        component: name.split(" ").join("")
      });
    },
    toggleDialog({ visibility, title, component }) {
      this.dialog = {
        visibility,
        title,
        component
      };
    },
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    },
    editDiscount(data) {
      _transactionsUpdateDiscount(data, data.id)
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

          this.getTransactions();
          this.$emit("get-statistics");
        })
        .catch(error => {});
    },
    cancelTransaction(data) {
      _transactionsDestroy(data, data.id)
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

          this.getTransactions();
          this.$emit("get-statistics");
        })
        .catch(error => {});
    },
    restoreTransaction(data) {
      this.$confirm(
        `Are you sure you want to restore transaction ${data.tracking}?`,
        "Restore Transaction",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          _transactionsRestore(data.id)
            .then(response => {
              this.showNotification({
                title: "Success",
                message: response.data.message,
                type: "success"
              });

              this.getTransactions();
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
    },
    toggleRow(row, component) {
      if (!("component" in row)) {
        row.component = component;
        this.$refs["transactions-table"].toggleRowExpansion(row, true);
      } else if (row.component == component) {
        this.$refs["transactions-table"].toggleRowExpansion(row);
      } else {
        row.component = component;
        this.$refs["transactions-table"].toggleRowExpansion(row, false);
        setTimeout(() => {
          this.$refs["transactions-table"].toggleRowExpansion(row, true);
        }, 500);
      }
    }
  },
  components: {
    EditDiscount,
    CancelTransaction,
    ClientsServicesExpand,
    ClientsPaymentsExpand
  },
  created() {
    this.getTransactions();
  }
};
</script>

<style lang="scss">
#client-profile-visa-page .el-table.transactions-table th,
#client-profile-visa-page .el-table.transactions-table td {
  padding: 5px 0px;
}
#client-profile-visa-page .el-table.transactions-table .danger-row {
  background: #fef0f0 !important;
  text-decoration: line-through;
}
#client-profile-visa-page
  .el-table.transactions-table
  td:first-child
  .el-table__expand-icon {
  display: none;
}
</style>
<style lang="scss" scoped>
button.create-btn {
  float: right;
}
.header-card {
  border: none;
}
.table-card {
  border: none;
  margin-top: 20px;
}
.transactions-table {
  font-size: 12px;

  .tracking-block {
    span {
      display: block;
    }
    .tracking {
      color: #000;
    }
    .number-of-services {
      font-size: 11px;
    }
  }

  .icon-button {
    font-size: 15px;
    color: #1d8ce0;
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
.pagination {
  margin-top: 20px;
}
</style>
