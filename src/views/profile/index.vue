<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="6">
          <left-content :user="user" @show-notification="showNotification" />
        </el-col>
        <el-col :span="18">
          <right-content :user="user" @show-notification="showNotification" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import LeftContent from "./left-content/index.vue";
import RightContent from "./right-content/index.vue";

export default {
  name: "Profile",
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    }
  },
  components: {
    LeftContent,
    RightContent
  }
};
</script>
