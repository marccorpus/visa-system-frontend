<template>
  <el-container>
    <el-main class="the-main">
      <el-alert
        title="Error"
        type="error"
        :description="notFound"
        show-icon
        :closable="false"
        effect="dark"
      >
      </el-alert>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "AccountsNotFound",
  props: ["notFound"]
};
</script>

<style lang="scss" scoped>
.the-main {
  margin-top: -15px;
}
</style>
