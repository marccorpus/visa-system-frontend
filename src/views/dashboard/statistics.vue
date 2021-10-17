<template>
  <el-row
    :gutter="20"
    class="statistics-container"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-col :span="6">
      <div class="stati bg-carrot left">
        <i class="el-icon-money" />
        <div>
          <b>{{ totalClients }}</b>
          <span>TOTAL CLIENTS</span>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="stati bg-belize_hole left">
        <i class="el-icon-money" />
        <div>
          <b>{{ totalServices }}</b>
          <span>TOTAL SERVICES</span>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="stati bg-alizarin left">
        <i class="el-icon-money" />
        <div>
          <b>{{ todaysTotalServiceCost }}</b>
          <span>TODAY’S TOTAL SERVICE COST</span>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="stati bg-green_sea left">
        <i class="el-icon-money" />
        <div>
          <b>{{ yesterdaysTotalServiceCost }}</b>
          <span>YESTERDAY’S TOTAL SERVICE COST</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { moneyFormat } from "@/utils/index";
import { dashboardStatistics } from "@/api/transaction";

export default {
  name: "DashboardStatistics",
  data() {
    return {
      loading: false,

      totalClients: null,
      totalServices: null,
      todaysTotalServiceCost: null,
      yesterdaysTotalServiceCost: null
    };
  },
  methods: {
    moneyFormat(val) {
      return moneyFormat(parseFloat(val).toFixed(2));
    },
    getStatistics() {
      this.loading = true;

      dashboardStatistics()
        .then(response => {
          const {
            totalClients,
            totalServices,
            todaysTotalServiceCost,
            yesterdaysTotalServiceCost
          } = response.data.data;

          this.totalClients = totalClients;
          this.totalServices = totalServices;
          this.todaysTotalServiceCost = this.moneyFormat(
            todaysTotalServiceCost
          );
          this.yesterdaysTotalServiceCost = this.moneyFormat(
            yesterdaysTotalServiceCost
          );

          this.loading = false;
        })
        .catch(() => {});
    }
  },
  created() {
    this.getStatistics();
  }
};
</script>

<style lang="scss" scoped>
.statistics-container {
  margin-top: 10px;
}
.stati {
  background: #fff;
  height: 5em;
  padding: 0.7em;
  margin: 0.5em 0;
  -webkit-transition: margin 0.5s ease, box-shadow 0.5s ease; /* Safari */
  transition: margin 0.5s ease, box-shadow 0.5s ease;
}
.stati:hover {
  margin-top: 0.5em;
  -moz-box-shadow: 0px 0.4em 0.5em rgb(0, 0, 0, 0.8);
  -webkit-box-shadow: 0px 0.4em 0.5em rgb(0, 0, 0, 0.8);
  box-shadow: 0px 0.4em 0.5em rgb(0, 0, 0, 0.8);
}
.stati i {
  font-size: 2.5em;
}
.stati div {
  width: calc(100% - 2.5em);
  display: block;
  float: right;
  text-align: right;
}
.stati div b {
  font-size: 1.1em;
  width: 100%;
  padding-top: 0px;
  margin-top: 0.3em;
  margin-bottom: 0.5em;
  display: block;
}
.stati div span {
  font-size: 0.7em;
  width: 100%;
  color: rgb(0, 0, 0, 0.8) !important;
  display: block;
}
.stati.left div {
  float: left;
  text-align: left;
}

.stati.bg-carrot {
  background: rgb(230, 126, 34);
  color: white;
}
.stati.bg-belize_hole {
  background: rgb(41, 128, 185);
  color: white;
}
.stati.bg-alizarin {
  background: rgb(231, 76, 60);
  color: white;
}
.stati.bg-green_sea {
  background: rgb(22, 160, 133);
  color: white;
}
</style>
