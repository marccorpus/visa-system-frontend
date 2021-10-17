<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="stati carrot left">
          <i class="el-icon-money" />
          <div>
            <b>{{ totalServiceCost }}</b>
            <span>TOTAL SERVICE COST</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stati belize_hole left">
          <i class="el-icon-money" />
          <div>
            <b>{{ totalCompletedServiceCost }}</b>
            <span>TOTAL COMPLETED SERVICE COST</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stati alizarin left">
          <i class="el-icon-money" />
          <div>
            <b>{{ totalDiscount }}</b>
            <span>TOTAL DISCOUNT</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stati green_sea left">
          <i class="el-icon-money" />
          <div>
            <b>{{ totalAmountPaid }}</b>
            <span>TOTAL AMOUNT PAID</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="stati midnight_blue left">
          <i class="el-icon-money" />
          <div>
            <b>{{ totalBalance }}</b>
            <span>TOTAL BALANCE</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="stati midnight_blue left">
          <i class="el-icon-money" />
          <div>
            <b>{{ totalCollectable }}</b>
            <span>TOTAL COLLECTABLE</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "GroupsStatistics",
  props: [
    "loading",
    "totalServiceCost",
    "totalCompletedServiceCost",
    "totalDiscount",
    "totalAmountPaid",
    "totalBalance",
    "totalCollectable"
  ]
};
</script>

<style lang="scss" scoped>
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

.stati.carrot {
  color: rgb(230, 126, 34);
}
.stati.belize_hole {
  color: rgb(41, 128, 185);
}
.stati.alizarin {
  color: rgb(231, 76, 60);
}
.stati.green_sea {
  color: rgb(22, 160, 133);
}
.stati.midnight_blue {
  color: rgb(44, 62, 80);
}
</style>
