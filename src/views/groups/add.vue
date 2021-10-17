<template>
  <div>
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="groupForm"
      size="small"
    >
      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="Enter group name"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        icon="el-icon-circle-close"
        @click="$emit('toggle-dialog', false)"
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
import { store } from "@/api/group";

export default {
  name: "GroupsAdd",
  data() {
    var validateName = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The name field is required."));
      } else if (value.trim().length > 255) {
        callback(
          new Error("The name must not be greater than 255 characters.")
        );
      } else {
        callback();
      }
    };

    return {
      loading: false,

      form: {
        name: ""
      },

      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }]
      },
      errors: {
        name: ""
      }
    };
  },
  methods: {
    save() {
      this.loading = true;

      this.$refs["groupForm"].validate(valid => {
        if (valid) {
          this.resetErrors();

          this.handleAdd();
        } else {
          this.loading = false;

          return false;
        }
      });
    },
    resetErrors() {
      this.errors = { name: "" };
    },
    handleAdd() {
      store(this.form)
        .then(response => {
          this.loading = false;

          this.$emit("toggle-dialog", false);

          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$router.push({
            name: "GroupProfile",
            params: { id: response.data.data.id }
          });
        })
        .catch(error => {
          this.loading = false;

          return this.catchError(error);
        });
    },
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    },
    catchError(error) {
      const { message } = error.response.data;

      if (message) {
        this.showNotification({
          title: "Error",
          message: message,
          type: "error"
        });
      } else {
        // Server-side validation
        const errors = error.response.data.data.errors;

        this.showInlineErrors(errors);
      }

      return false;
    },
    showInlineErrors(errors) {
      for (var key in errors) {
        this.errors[key] = errors[key][0];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
div.dialog-footer {
  text-align: right;
}
</style>
