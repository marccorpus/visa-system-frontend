<template>
  <el-form
    :model="form"
    status-icon
    :rules="rules"
    ref="changePasswordForm"
    size="small"
  >
    <el-form-item
      label="Current Password"
      prop="current_password"
      :error="errors.current_password"
    >
      <el-input
        type="password"
        v-model="form.current_password"
        autocomplete="off"
        placeholder="Enter current password"
      ></el-input>
    </el-form-item>

    <el-form-item
      label="New Password"
      prop="new_password"
      :error="errors.new_password"
    >
      <el-input
        type="password"
        v-model="form.new_password"
        autocomplete="off"
        placeholder="Enter new password"
      ></el-input>
    </el-form-item>

    <el-form-item
      label="New Password Confirmation"
      prop="new_password_confirmation"
      :error="errors.new_password_confirmation"
    >
      <el-input
        type="password"
        v-model="form.new_password_confirmation"
        autocomplete="off"
        placeholder="Enter new password confirmation"
      ></el-input>
    </el-form-item>

    <el-form-item class="pull-right">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-circle-check"
        :loading="loading"
        @click="save"
        >Save</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { changePassword } from "@/api/user";

export default {
  name: "ProfileSecurity",
  props: ["user"],
  data() {
    var validateCurrentPassword = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The current password field is required."));
      } else {
        callback();
      }
    };

    var validateNewPassword = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The new password field is required."));
      } else if (value.trim().length < 6) {
        callback(new Error("The new password must be at least 6 characters."));
      } else {
        if (this.form.new_password_confirmation !== "") {
          this.$refs.changePasswordForm.validateField(
            "new_password_confirmation"
          );
        }
        callback();
      }
    };

    var validateNewPasswordConfirmation = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The new password confirmation field is required."));
      } else if (value.trim().length < 6) {
        callback(
          new Error(
            "The new password confirmation must be at least 6 characters."
          )
        );
      } else if (value.trim() !== this.form.new_password) {
        callback(new Error("The new password confirmation does not match."));
      } else {
        callback();
      }
    };

    return {
      loading: false,

      form: {
        id: "",
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
      },

      rules: {
        current_password: [
          {
            required: true,
            validator: validateCurrentPassword,
            trigger: "blur"
          }
        ],
        new_password: [
          { required: true, validator: validateNewPassword, trigger: "blur" }
        ],
        new_password_confirmation: [
          {
            required: true,
            validator: validateNewPasswordConfirmation,
            trigger: "blur"
          }
        ]
      },

      errors: {
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
      }
    };
  },
  methods: {
    resetErrors() {
      this.errors = {
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
      };
    },
    save() {
      this.loading = true;

      this.$refs["changePasswordForm"].validate(valid => {
        if (valid) {
          this.resetErrors();

          this.changePassword();
        } else {
          this.loading = false;

          return false;
        }
      });
    },
    changePassword() {
      changePassword(this.form, this.form.id)
        .then(response => {
          this.loading = false;

          this.$refs.changePasswordForm.resetFields();

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
    }
  },
  watch: {
    user: {
      handler: function(value) {
        if (value) {
          this.form.id = value.id;
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.pull-right {
  float: right;
}
</style>
