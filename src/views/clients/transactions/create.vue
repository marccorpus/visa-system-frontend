<template>
  <el-container id="client-create-transaction-page">
    <el-main>
      <client-create-transaction-header
        title="Create New Transaction"
        :id="clientId"
        :name="clientName"
      />

      <template v-if="notFound">
        <client-create-transaction-not-found :not-found="notFound" />
      </template>
      <template v-else>
        <el-card v-loading="loading" :body-style="bodyStyle" class="the-card">
          <el-form
            :model="form"
            status-icon
            :rules="rules"
            ref="form"
            label-position="top"
            size="small"
          >
            <el-form-item label="Bill to">
              <el-input v-model="clientName" disabled></el-input>
            </el-form-item>

            <el-form-item label="Services" prop="services">
              <el-select
                v-model="form.services"
                placeholder="Select"
                class="full-width"
                multiple
                filterable
                value-key="id"
                @remove-tag="removeTag"
              >
                <el-option-group
                  v-for="parentService in services"
                  :key="parentService.id"
                  :label="parentService.name"
                >
                  <el-option
                    v-for="service in parentService.services"
                    :key="service.id"
                    :label="`[${parentService.name}] ${service.name}`"
                    :value="service"
                  >
                    {{ service.name }}
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-table
              v-if="form.services.length > 0"
              :data="form.services"
              show-summary
              :summary-method="getSummaries"
              :header-cell-style="headerCellStyle"
              :row-style="rowStyle"
              class="selected-services-table"
            >
              <el-table-column label="Service" width="500">
                <template slot-scope="scope">
                  [{{ scope.row.parent_service_name }}] {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="Status" align="center">
                <template slot-scope="scope">
                  <el-form-item
                    class="m-b-0"
                    :prop="'services.' + scope.$index + '.status'"
                  >
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
              <el-table-column label="Service Cost" align="center">
                <template slot-scope="scope">
                  {{
                    formatCost(
                      scope.row.cost,
                      scope.row.under,
                      scope.row.charge
                    )
                  }}
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
                @click="goBackToClient"
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

import ClientCreateTransactionHeader from "./header.vue";
import ClientCreateTransactionNotFound from "./not-found.vue";

import { show as _clientsShow } from "@/api/client";
import { indexWithRates as _servicesIndexWithRates } from "@/api/service";
import { store as _transactionsStore } from "@/api/transaction";

export default {
  name: "ClientCreateTransaction",
  props: ["id"],
  data() {
    var validateServices = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("The services field is required."));
      } else {
        callback();
      }
    };

    return {
      notFound: null,

      loading: false,

      clientId: null,
      clientName: null,

      services: [],
      statuses: [
        { id: 1, label: "Pending", value: "Pending" },
        { id: 2, label: "On Process", value: "On Process" }
      ],

      rules: {
        services: [
          { required: true, validator: validateServices, trigger: "change" }
        ],
        discount: [
          {
            type: "number",
            message: "The discount must be digits."
          }
        ]
      },
      form: {
        services: [],
        discount: 0
      },

      saveLoading: false
    };
  },
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
  methods: {
    getClient() {
      this.loading = true;

      _clientsShow(this.id)
        .then(response => {
          this.loading = false;

          const client = response.data.data.client;

          const { id, first_name, last_name } = client;

          this.clientId = id;
          this.clientName = `${first_name} ${last_name}`;
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
    getServices() {
      _servicesIndexWithRates()
        .then(response => {
          const parentServices = response.data.data.parent_services;

          let temp = [];
          const clientId = this.id;
          const groupId = null;
          const status = "Pending";

          parentServices.forEach(parentService => {
            let parent = {
              id: parentService.id,
              name: parentService.name,
              services: []
            };

            parentService.services.forEach(service => {
              let cost = 0;
              let under = 0;
              let charge = 0;
              if (service.rates.length == 1) {
                cost = service.rates[0].pivot.cost;
                under = service.rates[0].pivot.under;
                charge = service.rates[0].pivot.charge;
              }

              let child = {
                id: service.id,
                name: service.name,
                parent_service_name: parentService.name,
                client_id: clientId,
                group_id: groupId,
                cost,
                under,
                charge,
                status
              };

              parent.services.push(child);
            });

            temp.push(parent);
          });

          this.services = temp;
        })
        .catch(() => {});
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      sums[0] = "Total Service Cost";
      sums[1] = "";

      columns.forEach((column, index) => {
        if (index == 2) {
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
    removeTag(val) {
      val.status = "Pending";
    },
    goBackToClient() {
      this.$router.push({
        name: "ClientProfile",
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
    save() {
      this.saveLoading = true;

      this.$refs["form"].validate(valid => {
        if (valid) {
          _transactionsStore(this.form)
            .then(response => {
              this.saveLoading = false;

              this.showNotification({
                title: "Success",
                message: response.data.message,
                type: "success"
              });

              this.goBackToClient();
            })
            .catch(() => {});
        } else {
          this.saveLoading = false;

          return false;
        }
      });
    }
  },
  created() {
    this.getClient();
    this.getServices();
  },
  components: {
    ClientCreateTransactionHeader,
    ClientCreateTransactionNotFound
  }
};
</script>

<style lang="scss">
#client-create-transaction-page .el-table th,
#client-create-transaction-page .el-table td {
  padding: 5px 0px;
}
#client-create-transaction-page .el-table__footer-wrapper tbody td,
.el-table__header-wrapper tbody td {
  color: #303133 !important;
  font-weight: bold !important;
  background-color: #fbf3d0;
}
</style>
<style lang="scss" scoped>
.full-width {
  width: 100%;
}
.the-card {
  margin-top: 11px;
}
.form-footer {
  margin-top: 12px;
  text-align: right;
}
.selected-services-table {
  font-size: 12px;
  margin-bottom: 17px;

  .m-b-0 {
    margin-bottom: 0px;
  }
}
</style>
