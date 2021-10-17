<template>
  <el-container>
    <el-main>
      <template v-if="notFound">
        <clients-header title="Client Profile" />

        <clients-not-found :not-found="notFound" />
      </template>

      <el-row v-else :gutter="20">
        <el-col :span="5">
          <user-card
            :loading="userCardLoading"
            :client="client"
            @get-client="getClient"
          />
        </el-col>
        <el-col :span="19">
          <actions />

          <statistics
            class="statistics"
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
import ClientsHeader from "./header.vue";
import ClientsNotFound from "./not-found.vue";

import { moneyFormat } from "@/utils/index";

import UserCard from "./left-content/user-card.vue";
import { show as _clientsShow } from "@/api/client";
import { statistics as _clientsStatistics } from "@/api/client";

import Actions from "./right-content/actions.vue";
import Statistics from "./right-content/statistics.vue";
import DataManager from "./right-content/data-manager.vue";

export default {
  name: "ClientProfile",
  props: ["id"],
  data() {
    return {
      notFound: null,

      userCardLoading: false,
      client: null,

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
    getClient() {
      this.userCardLoading = true;

      _clientsShow(this.id)
        .then(response => {
          this.userCardLoading = false;

          this.client = response.data.data.client;
        })
        .catch(error => {
          this.userCardLoading = false;

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

      _clientsStatistics(this.id)
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
    this.getClient();
    this.getStatistics();
  },
  components: {
    ClientsHeader,
    ClientsNotFound,
    UserCard,
    Actions,
    Statistics,
    DataManager
  }
};
</script>

<style lang="scss" scoped>
.statistics {
  margin: 10px 0px;
}
</style>
