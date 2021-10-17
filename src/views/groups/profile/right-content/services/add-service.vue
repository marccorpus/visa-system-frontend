<template>
  <div id="groups-services-expand-add-service">
    <div class="the-card">
      <groups-services-expand-add-services-form @add-services="addServices" />

      <el-form
        :model="form"
        status-icon
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
              <span class="service-name"> {{ scope.row.service_name }}</span>
              <span class="parent-service-name"
                >[{{ scope.row.parent_service_name }}]</span
              >
            </template>
          </el-table-column>
          <el-table-column label="Client">
            <template slot-scope="scope">{{ scope.row.client_name }}</template>
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
      </el-form>
    </div>

    <div class="the-footer">
      <el-row>
        <el-col :span="24">
          <el-button
            size="small"
            icon="el-icon-circle-close"
            @click="
              $emit('toggle-dialog', {
                visibility: false,
                title: null,
                component: null
              })
            "
            >Cancel</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-check"
            :loading="loading"
            @click="save"
            >Save</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { moneyFormat } from "@/utils/index";
import GroupsServicesExpandAddServicesForm from "./add-services-form.vue";

export default {
  name: "GroupsServicesExpandAddService",
  props: ["transaction"],
  data() {
    return {
      statuses: [
        { id: 1, label: "Pending", value: "Pending" },
        { id: 2, label: "On Process", value: "On Process" }
      ],

      loading: false,
      form: {
        transaction_id: null,
        services: []
      }
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
      this.loading = true;

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.services.length == 0) {
            this.showNotification({
              title: "Error",
              message: "Service and clients field are required.",
              type: "error"
            });

            this.loading = false;
          } else {
            this.$emit("additional-services", this.form);
          }
        } else {
          this.loading = false;

          return false;
        }
      });
    }
  },
  components: {
    GroupsServicesExpandAddServicesForm
  },
  created() {
    this.form.transaction_id = this.transaction.id;
  }
};
</script>

<style lang="scss">
#groups-services-expand-add-service .el-table th,
#groups-services-expand-add-service .el-table td {
  padding: 5px 0px;
}
#groups-services-expand-add-service .el-table__footer-wrapper tbody td {
  color: #303133 !important;
  font-weight: bold !important;
  background-color: #fbf3d0;
}
</style>
<style lang="scss" scoped>
#groups-services-expand-add-service {
  .the-card {
    .selected-services-table {
      font-size: 12px;
      margin-bottom: 17px;

      .service-name,
      .parent-service-name {
        display: block;
      }
      .parent-service-name {
        font-size: 11px;
      }

      .full-width {
        width: 100%;
      }

      .icon-cancel {
        font-size: 15px;
        cursor: pointer;
        margin: 0 5px;
        color: #f56c6c;
      }
    }
  }

  .the-footer {
    margin-top: 12px;
    text-align: right;
  }
}
</style>
