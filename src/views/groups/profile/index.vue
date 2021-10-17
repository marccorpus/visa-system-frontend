<template>
  <el-container>
    <el-main>
      <template v-if="notFound">
        <groups-header title="Group Profile" />

        <groups-not-found :not-found="notFound" />
      </template>

      <el-row v-else :gutter="20">
        <el-col :span="5">
          <group-card
            :loading="groupCardLoading"
            :group="group"
            @get-group="getGroup"
          />
        </el-col>
        <el-col :span="19">
          <actions />

          <statistics
            class="statictics"
            :loading="statisticsLoading"
            :total-service-cost="totalServiceCost"
            :total-completed-service-cost="totalCompletedServiceCost"
            :total-discount="totalDiscount"
            :total-amount-paid="totalAmountPaid"
            :total-balance="totalBalance"
            :total-collectable="totalCollectable"
          />

          <data-manager :id="id" @get-statistics="getStatistics" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import GroupsHeader from "./header.vue";
import GroupsNotFound from "./not-found.vue";

import { moneyFormat } from "@/utils/index";

import GroupCard from "./left-content/group-card.vue";
import { show as _groupsShow } from "@/api/group";
import { statistics as _groupsStatistics } from "@/api/group";

import Actions from "./right-content/actions.vue";
import Statistics from "./right-content/statistics.vue";
import DataManager from "./right-content/data-manager.vue";

export default {
  name: "GroupProfile",
  props: ["id"],
  data() {
    return {
      notFound: null,

      groupCardLoading: false,
      group: null,

      statisticsLoading: false,
      totalServiceCost: "0.00",
      totalCompletedServiceCost: "0.00",
      totalDiscount: "0.00",
      totalAmountPaid: "0.00",
      totalBalance: "0.00",
      totalCollectable: "0.00"
    };
  },
  methods: {
    getGroup() {
      this.groupCardLoading = true;

      _groupsShow(this.id)
        .then(response => {
          this.groupCardLoading = false;

          this.group = response.data.data.group;
        })
        .catch(error => {
          this.groupCardLoading = false;

          if ("response" in error) {
            const { status, data } = error.response;

            if (status == 404) {
              this.notFound = data.message;
            }
          }
        });
    },
    getStatistics() {
      this.statisticsLoading = true;

      _groupsStatistics(this.id)
        .then(response => {
          this.statisticsLoading = false;

          const {
            totalServiceCost,
            totalCompletedServiceCost,
            totalDiscount,
            totalAmountPaid,
            totalBalance,
            totalCollectable
          } = response.data.data;

          this.totalServiceCost = moneyFormat(
            parseFloat(totalServiceCost).toFixed(2)
          );
          this.totalCompletedServiceCost = moneyFormat(
            parseFloat(totalCompletedServiceCost).toFixed(2)
          );
          this.totalDiscount = moneyFormat(
            parseFloat(totalDiscount).toFixed(2)
          );
          this.totalAmountPaid = moneyFormat(
            parseFloat(totalAmountPaid).toFixed(2)
          );
          this.totalBalance = moneyFormat(parseFloat(totalBalance).toFixed(2));
          this.totalCollectable = moneyFormat(
            parseFloat(totalCollectable).toFixed(2)
          );
        })
        .catch(() => {});
    }
  },
  created() {
    this.getGroup();
    this.getStatistics();
  },
  components: {
    GroupsHeader,
    GroupsNotFound,
    GroupCard,
    Actions,
    Statistics,
    DataManager
  }
};
</script>

<style lang="scss" scoped>
.statictics {
  margin: 10px 0px;
}
</style>
