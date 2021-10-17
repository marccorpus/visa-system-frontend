<template>
  <el-tabs type="border-card" @tab-click="tabClick">
    <el-tab-pane label="Visa">
      <visa
        :id="id"
        :tab-clicked="tabClicked"
        @get-statistics="$emit('get-statistics')"
      />
    </el-tab-pane>
    <el-tab-pane label="Transaction Logs">
      <transaction-logs :tab-clicked="tabClicked" />
    </el-tab-pane>
    <el-tab-pane label="Payment Logs">
      <payment-logs :tab-clicked="tabClicked" />
    </el-tab-pane>
    <el-tab-pane label="Profile Logs">
      <profile-logs :tab-clicked="tabClicked" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Visa from "./visa.vue";
import TransactionLogs from "./transaction-logs.vue";
import PaymentLogs from "./payment-logs.vue";
import ProfileLogs from "./profile-logs.vue";

export default {
  name: "ClientsDataManager",
  props: ["id"],
  data() {
    return {
      tabClicked: null
    };
  },
  methods: {
    tabClick(tab) {
      this.tabClicked = tab.label;
    }
  },
  components: {
    Visa,
    TransactionLogs,
    PaymentLogs,
    ProfileLogs
  }
};
</script>
