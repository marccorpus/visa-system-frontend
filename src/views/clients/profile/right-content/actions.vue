<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-back"
        @click="$router.push({ name: 'Clients' })"
        >Back to Clients</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-back"
        @click="$router.push({ name: 'Dashboard' })"
        >Back to Dashboard</el-button
      >
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "ClientsAction"
};
</script>

<style lang="scss" scoped>
button {
  float: right;
  margin-left: 10px;
}
</style>
