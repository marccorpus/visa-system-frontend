<template>
  <el-container id="group-create-transaction-page">
    <el-main>
      <group-create-transaction-header
        title="Create New Transaction"
        :id="groupId"
        :name="groupName"
      />

      <template v-if="notFound">
        <group-create-transaction-not-found :not-found="notFound" />
      </template>
      <template v-else>
        <el-card v-loading="loading" :body-style="bodyStyle" class="the-card">
          <el-form label-position="top" size="small">
            <el-form-item label="Bill to">
              <el-input v-model="groupName" disabled></el-input>
            </el-form-item>
          </el-form>

          <group-create-transaction-add-services-form
            :id="id"
            @add-services="addServices"
          />

          <el-form
            :model="form"
            status-icon
            :rules="rules"
            ref="form"
            label-position="top"
            size="small"
          >
            <el-table
              :data="form.services"
              :header-cell-style="headerCellStyle"
              :row-style="rowStyle"
              show-summary
              :summary-method="getSummaries"
              class="selected-services-table"
            >
              <el-table-column label="Service">
                <template slot-scope="scope">
                  <span class="service-name">
                    {{ scope.row.service_name }}</span
                  >
                  <span class="parent-service-name"
                    >[{{ scope.row.parent_service_name }}]</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="Client">
                <template slot-scope="scope">{{
                  scope.row.client_name
                }}</template>
              </el-table-column>
              <el-table-column label="Status" align="center" width="150">
                <template slot-scope="scope">
                  <el-form-item class="m-b-0">
                    <el-select
                      v-model="form.services[scope.$index].status"
                      placeholder="Select"
                      class="full-width"
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
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="Service Cost" align="center" width="150">
                <template slot-scope="scope">
                  {{
                    formatCost(
                      form.services[scope.$index].cost,
                      form.services[scope.$index].under,
                      form.services[scope.$index].charge
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Remove"
                    placement="top"
                  >
                    <i
                      class="el-icon-circle-close icon-cancel"
                      @click="remove(scope.row)"
                    ></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>

            <el-form-item label="Discount" prop="discount">
              <el-input
                v-model.number="form.discount"
                placeholder="Enter discount"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card :body-style="bodyStyle" class="form-footer">
          <el-row>
            <el-col :span="24">
              <el-button
                size="small"
                icon="el-icon-circle-close"
                @click="goBackToGroup"
                >Cancel</el-button
              >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-circle-check"
                :loading="saveLoading"
                @click="save"
                >Save</el-button
              >
            </el-col>
          </el-row>
        </el-card>
      </template>
    </el-main>
  </el-container>
</template>

<script>
import { moneyFormat } from "@/utils/index";

import GroupCreateTransactionHeader from "./header.vue";
import GroupCreateTransactionNotFound from "./not-found.vue";
import GroupCreateTransactionAddServicesForm from "./add-services-form.vue";

import { show as _groupsShow } from "@/api/group";
import { store as _transactionsStore } from "@/api/transaction";

export default {
  name: "GroupCreateTransaction",
  props: ["id"],
  computed: {
    bodyStyle() {
      return { padding: "10px" };
    },
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#FBF3D0" };
    },
    rowStyle() {
      return { backgroundColor: "#FEFCF3" };
    }
  },
  data() {
    return {
      notFound: null,

      loading: false,

      groupId: null,
      groupName: null,

      statuses: [
        { id: 1, label: "Pending", value: "Pending" },
        { id: 2, label: "On Process", value: "On Process" }
      ],

      rules: {
        discount: [
          {
            type: "number",
            message: "The discount must be digits."
          }
        ]
      },
      saveLoading: false,
      form: {
        services: [],
        discount: 0
      }
    };
  },
  methods: {
    getGroup() {
      this.loading = true;

      _groupsShow(this.id)
        .then(response => {
          this.loading = false;

          const group = response.data.data.group;

          const { id, name } = group;

          this.groupId = id;
          this.groupName = name;
        })
        .catch(error => {
          this.loading = false;

          if ("response" in error) {
            const { status, data } = error.response;

            if (status == 404) {
              this.notFound = data.message;
            }
          }
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      sums[0] = "Total Service Cost";
      sums[1] = "";
      sums[2] = "";
      sums[4] = "";

      columns.forEach((column, index) => {
        if (index == 3) {
          let totalServiceCost = 0;

          data.forEach(d => {
            const cost = parseFloat(d.cost.split(",").join(""));
            const under = parseFloat(d.under.split(",").join(""));
            const charge = parseFloat(d.charge.split(",").join(""));

            totalServiceCost += cost + under + charge;
          });

          sums[index] = moneyFormat(totalServiceCost.toFixed(2));
        }
      });

      return sums;
    },
    formatCost(cost, under, charge) {
      return moneyFormat(
        (parseFloat(cost) + parseFloat(under) + parseFloat(charge)).toFixed(2)
      );
    },
    goBackToGroup() {
      this.$router.push({
        name: "GroupProfile",
        params: { id: this.id }
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
    addServices(services) {
      services.forEach(service => {
        const found = this.form.services.filter(
          formService =>
            formService.id == service.id &&
            formService.client_id == service.client_id
        );

        if (found.length == 0) {
          this.form.services.push(service);
        }
      });
    },
    remove(row) {
      const index = this.form.services.findIndex(service => service == row);

      this.form.services.splice(index, 1);
    },
    save() {
      this.saveLoading = true;

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.services.length == 0) {
            this.showNotification({
              title: "Error",
              message: "Service and clients field are required.",
              type: "error"
            });

            this.saveLoading = false;
          } else {
            _transactionsStore(this.form)
              .then(response => {
                this.saveLoading = false;

                this.showNotification({
                  title: "Success",
                  message: response.data.message,
                  type: "success"
                });

                this.goBackToGroup();
              })
              .catch(() => {});
          }
        } else {
          this.saveLoading = false;

          return false;
        }
      });
    }
  },
  created() {
    this.getGroup();
  },
  components: {
    GroupCreateTransactionHeader,
    GroupCreateTransactionNotFound,
    GroupCreateTransactionAddServicesForm
  }
};
</script>

<style lang="scss">
#group-create-transaction-page .el-table th,
#group-create-transaction-page .el-table td {
  padding: 5px 0px;
}
#group-create-transaction-page .el-table__footer-wrapper tbody td {
  color: #303133 !important;
  font-weight: bold !important;
  background-color: #fbf3d0;
}
</style>
<style lang="scss" scoped>
.form-footer {
  margin-top: 12px;
  text-align: right;
}
.full-width {
  width: 100%;
}
.the-card {
  margin-top: 11px;

  .selected-services-table {
    font-size: 12px;
    margin-bottom: 17px;

    .m-b-0 {
      margin-bottom: 0px;
    }

    .service-name,
    .parent-service-name {
      display: block;
    }
    .parent-service-name {
      font-size: 11px;
    }

    .icon-cancel {
      font-size: 15px;
      cursor: pointer;
      margin: 0 5px;
      color: #f56c6c;
    }
  }
}
</style>
