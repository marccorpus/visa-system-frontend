<template>
  <el-card :body-style="bodyStyle">
    <el-row>
      <el-col :span="12" class="title">{{ title }}</el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-back"
          class="back-btn"
          @click="$router.push({ name: 'Groups' })"
          >Back to Groups</el-button
        >
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "GroupsHeader",
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
.title {
  font-weight: bold;
  line-height: 2;
}
</style>
