<template>
  <el-container>
    <el-header class="the-header">
      <el-card :body-style="bodyStyle">
        <el-row>
          <el-col :span="12" class="title">{{ title }}</el-col>
          <el-col :span="12">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-back"
              class="back-btn"
              @click="$emit('go-to-accounts')"
              >Back to Accounts</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </el-header>
  </el-container>
</template>

<script>
export default {
  name: "AccountsHeader",
  props: ["title"],
  computed: {
    bodyStyle() {
      return { padding: "10px" };
    }
  }
};
</script>

<style lang="scss" scoped>
button.back-btn {
  float: right;
}
.the-header {
  margin-top: 20px;
}
.title {
  font-weight: bold;
  line-height: 2;
}
</style>
