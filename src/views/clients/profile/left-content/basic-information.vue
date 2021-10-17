<template>
  <div>
    <el-avatar class="avatar" :size="100">
      {{ initials }}
    </el-avatar>
    <h3>{{ firstName + " " + lastName }}</h3>
    <h6>ID: {{ id }}</h6>
    <h6
      v-if="group"
      class="group-link"
      @click="$router.push({ name: 'GroupProfile', params: { id: groupId } })"
    >
      <i class="el-icon-link" /> {{ group }}
    </h6>
    <h6 v-else>Group Not Applicable</h6>
  </div>
</template>

<script>
export default {
  name: "ClientProfileBasicInformation",
  props: ["client"],
  data() {
    return {
      id: null,
      initials: "",
      firstName: "",
      lastName: "",
      groupId: null,
      group: null
    };
  },
  watch: {
    client: {
      handler: function(value) {
        if (value) {
          const { id, first_name, last_name, group } = value;

          this.id = id;
          this.initials =
            first_name.charAt(0).toUpperCase() +
            last_name.charAt(0).toUpperCase();
          this.firstName = first_name;
          this.lastName = last_name;
          this.groupId = group ? group.id : null;
          this.group = group ? group.name : null;
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
.group-link {
  color: #07bfcb;
  cursor: pointer;
}
</style>
