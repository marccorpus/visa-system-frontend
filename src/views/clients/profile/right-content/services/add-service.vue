<template>
  <div id="client-profile-visa-page-services-expand-add-service">
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      label-position="top"
      size="small"
    >
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
        <el-table-column label="Service">
          <template slot-scope="scope">
            <span class="service-name">{{ scope.row.name }}</span>
            <span class="parent-service-name"
              >[{{ scope.row.parent_service_name }}]
            </span>
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
            {{ formatCost(scope.row.cost, scope.row.under, scope.row.charge) }}
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div slot="footer" class="dialog-footer">
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
    </div>
  </div>
</template>

<script>
import { moneyFormat } from "@/utils/index";
import { indexWithRates as _servicesIndexWithRates } from "@/api/service";

export default {
  name: "ClientsServicesExpandAddService",
  props: ["transaction"],
  data() {
    var validateServices = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("The services field is required."));
      } else {
        callback();
      }
    };

    return {
      services: [],
      statuses: [
        { id: 1, label: "Pending", value: "Pending" },
        { id: 2, label: "On Process", value: "On Process" }
      ],

      loading: false,
      rules: {
        services: [
          { required: true, validator: validateServices, trigger: "change" }
        ]
      },
      form: {
        transaction_id: null,
        services: []
      }
    };
  },
  computed: {
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#FBF3D0" };
    },
    rowStyle() {
      return { backgroundColor: "#FEFCF3" };
    }
  },
  watch: {
    transaction: {
      handler: function(value) {
        if (value) {
          const { id } = value;

          this.form.transaction_id = id;
        }
      },
      immediate: true
    }
  },
  methods: {
    getServices() {
      _servicesIndexWithRates()
        .then(response => {
          const parentServices = response.data.data.parent_services;

          let temp = [];
          const clientId = this.$route.params.id;
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
    save() {
      this.loading = true;

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("additional-services", this.form);
        } else {
          this.loading = false;

          return false;
        }
      });
    }
  },
  created() {
    this.getServices();
  }
};
</script>

<style lang="scss">
#client-profile-visa-page-services-expand-add-service .el-table th,
#client-profile-visa-page-services-expand-add-service .el-table td {
  padding: 5px 0px;
}
#client-profile-visa-page-services-expand-add-service
  .el-table__footer-wrapper
  tbody
  td,
.el-table__header-wrapper tbody td {
  color: #303133 !important;
  font-weight: bold !important;
  background-color: #fbf3d0;
}
</style>
<style lang="scss" scoped>
div.dialog-footer {
  text-align: right;
}
.full-width {
  width: 100%;
}
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
}
</style>
