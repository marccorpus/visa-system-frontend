<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Account">
      <account
        :user="user"
        @show-notification="data => $emit('show-notification', data)"
      />
    </el-tab-pane>
    <el-tab-pane label="Security">
      <security
        :user="user"
        @show-notification="data => $emit('show-notification', data)"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Account from "./account.vue";
import Security from "./security.vue";

export default {
  name: "ProfileRightContent",
  props: ["user"],
  components: {
    Account,
    Security
  }
};
</script>
