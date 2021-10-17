<template>
  <div>
    <el-form :model="form" status-icon :rules="rules" ref="form" size="small">
      <el-form-item label="Cancellation Reason" prop="deletion_reason">
        <el-input
          v-model="form.deletion_reason"
          autocomplete="off"
          placeholder="Enter cancellation reason"
        ></el-input>
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
  name: "ClientsServicesExpandCancelService",
  props: ["selectedServiceTransaction"],
  data() {
    var validateDeletionReason = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The cancellation reason field is required."));
      } else {
        callback();
      }
    };

    return {
      loading: false,

      form: {
        id: null,
        deletion_reason: ""
      },

      rules: {
        deletion_reason: [
          { validator: validateDeletionReason, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    save() {
      this.loading = true;

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = false;

          this.$emit("cancel-service", this.form);
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
          const { id } = value;

          this.form.id = id;
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
</style>
