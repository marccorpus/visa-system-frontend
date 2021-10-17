<template>
  <div>
    <el-avatar class="avatar" :size="100">
      {{ initials }}
    </el-avatar>
    <h3>{{ name }}</h3>
    <h6>ID: {{ id }}</h6>
  </div>
</template>

<script>
export default {
  name: "GroupProfileBasicInformation",
  props: ["group"],
  data() {
    return {
      id: null,
      initials: "",
      name: ""
    };
  },
  watch: {
    group: {
      handler: function(value) {
        if (value) {
          const { id, name } = value;

          this.id = id;
          this.initials = name.charAt(0).toUpperCase();
          this.name = name;
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
h3 {
  margin: 10px 0;
}
h6 {
  margin: 5px 0;
  text-transform: uppercase;
  font-weight: lighter;
}
.avatar {
  background-color: #07bfcb;
  color: #231e39;
  font-size: 40px;
  font-weight: bold;
}
</style>
