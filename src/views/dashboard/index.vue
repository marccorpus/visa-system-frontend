<template>
  <el-container>
    <el-main>
      <welcome />

      <statistics />

      <services />
    </el-main>
  </el-container>
</template>

<script>
import Welcome from "./welcome.vue";
import Statistics from "./statistics.vue";
import Services from "./services.vue";

export default {
  name: "Dashboard",
  components: {
    Welcome,
    Statistics,
    Services
  }
};
</script>
