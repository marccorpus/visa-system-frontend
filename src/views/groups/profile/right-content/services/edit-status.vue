<template>
  <div>
    <el-form :model="form" status-icon :rules="rules" ref="form" size="small">
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="form.status"
          placeholder="Select"
          class="full-width"
        >
          <el-option
            v-for="status in statuses"
            :key="status.id"
            :label="status.label"
            :value="status.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        icon="el-icon-circle-close"
        @click="
          $emit('toggle-dialog', {
            visibility: false,
            title: null,
            component: null
          })
        "
        >Cancel</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-circle-check"
        :loading="loading"
        @click="save"
        >Save</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupsServicesExpandEditStatus",
  props: ["selectedServiceTransaction"],
  data() {
    return {
      loading: false,

      statuses: [
        { id: 1, label: "Pending", value: "Pending" },
        { id: 2, label: "On Process", value: "On Process" },
        { id: 3, label: "Completed", value: "Completed" },
        { id: 4, label: "Released", value: "Released" }
      ],

      form: {
        id: null,
        status: ""
      },

      rules: {
        status: [{ required: true }]
      }
    };
  },
  methods: {
    save() {
      this.loading = true;

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = false;

          this.$emit("edit-status", this.form);
        } else {
          this.loading = false;

          return false;
        }
      });
    }
  },
  watch: {
    selectedServiceTransaction: {
      handler: function(value) {
        if (value) {
          const { id, status } = value;

          this.form = {
            id,
            status
          };
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
div.dialog-footer {
  text-align: right;
}
.full-width {
  width: 100%;
}
</style>
