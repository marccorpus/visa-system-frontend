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
          @click="back"
          >Back to {{ id ? name : "Groups" }}</el-button
        >
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "GroupCreateTransactionHeader",
  props: ["title", "id", "name"],
  computed: {
    bodyStyle() {
      return { padding: "10px" };
    }
  },
  methods: {
    back() {
      if (this.id) {
        this.$router.push({ name: "GroupProfile", params: { id: this.id } });
      } else {
        this.$router.push({ name: "Groups" });
      }
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
