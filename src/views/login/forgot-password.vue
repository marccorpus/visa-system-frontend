<template>
  <div>
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="forgotPasswordForm"
      size="small"
    >
      <el-form-item label="Email" prop="email" :error="errors.email">
        <el-input
          v-model="form.email"
          autocomplete="off"
          placeholder="Enter email"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" icon="el-icon-circle-close" @click="toggleDialog"
        >Cancel</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-circle-check"
        :loading="loading"
        @click="save"
        >Send Password Reset Link</el-button
      >
    </div>
  </div>
</template>

<script>
import { forgotPassword } from "@/api/user";

export default {
  name: "ForgotPassword",
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The email field is required."));
      } else if (!this.$emit("validate-email", value.trim())) {
        callback(new Error("The email must be a valid email address."));
      } else {
        callback();
      }
    };

    return {
      loading: false,

      form: {
        email: ""
      },

      rules: {
        email: [{ required: true, validator: validateEmail, trigger: "blur" }]
      },
      errors: {
        email: ""
      }
    };
  },
  methods: {
    handleForgotPassword() {
      forgotPassword(this.form)
        .then(response => {
          this.loading = false;

          this.toggleDialog();

          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });
        })
        .catch(error => {
          this.loading = false;

          return this.catchError(error);
        });
    },
    catchError(error) {
      const { message } = error.response.data;

      if (message) {
        this.$emit("show-notification", {
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
    },
    save() {
      this.loading = true;

      this.$refs["forgotPasswordForm"].validate(valid => {
        if (valid) {
          this.resetErrors();

          this.handleForgotPassword();
        } else {
          this.loading = false;

          return false;
        }
      });
    },
    toggleDialog() {
      this.$emit("toggle-dialog", false);
    },
    resetErrors() {
      this.errors = { email: "" };
    }
  }
};
</script>

<style lang="scss" scoped>
div.dialog-footer {
  text-align: right;
}
</style>
