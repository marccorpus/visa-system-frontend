<template>
  <div id="services-page-rates-table">
    <el-table
      :data="ratesData"
      style="width: 100%"
      :header-cell-style="headerCellStyle"
      :row-style="rowStyle"
      class="rates-table"
    >
      <el-table-column prop="rate_name" width="250">
        <template slot-scope="scope">
          <span class="rate-name">{{ scope.row.rate_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost"
        label="Cost"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="under"
        label="Under"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="charge"
        label="Charge"
        align="center"
      ></el-table-column>
      <el-table-column prop="total" label="Total" align="center">
        <template slot-scope="scope">
          <span class="total-cost">{{ scope.row.total }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { moneyFormat } from "@/utils/index";

export default {
  name: "ServicesRatesTable",
  props: ["service", "rates"],
  computed: {
    ratesData() {
      let ratesData = [];

      if ("parent_service_id" in this.service) {
        const rates = this.rates.filter(rate => rate.deleted_at == null);

        rates.forEach(rate => {
          let selectedRate = null;

          if ("rates" in this.service) {
            const serviceRates = this.service.rates.map(
              serviceRate => serviceRate.pivot
            );

            selectedRate = serviceRates.find(
              serviceRate => serviceRate.rate_id == rate.id
            );
          }

          let row = {};
          const _cost = selectedRate?.cost || 0;
          const _under = selectedRate?.under || 0;
          const _charge = selectedRate?.charge || 0;

          row["rate_name"] = rate.name;
          row["cost"] = moneyFormat(_cost);
          row["under"] = moneyFormat(_under);
          row["charge"] = moneyFormat(_charge);
          row["total"] = moneyFormat(
            (
              parseFloat(_cost) +
              parseFloat(_under) +
              parseFloat(_charge)
            ).toFixed(2)
          );

          ratesData.push(row);
        });
      }

      return ratesData;
    },
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#FBF3D0" };
    },
    rowStyle() {
      return { backgroundColor: "#FEFCF3" };
    }
  }
};
</script>

<style lang="scss">
#services-page-rates-table .el-table th,
#services-page-rates-table .el-table td {
  padding: 5px 0px;
}
</style>
<style lang="scss" scoped>
.rates-table {
  font-size: 12px;
}
span.rate-name {
  color: #409eff;
  font-weight: bold;
}
.total-cost {
  color: #303133;
  font-weight: bold;
}
</style>
