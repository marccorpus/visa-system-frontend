<template>
  <div class="reset-password-container">
    <el-form
      ref="resetPasswordForm"
      :model="resetPasswordForm"
      :rules="resetPasswordRules"
      class="reset-password-form"
      label-position="left"
      status-icon
    >
      <div class="title-container">
        <h3 class="title">
          Reset Password
        </h3>
      </div>

      <el-form-item prop="email" :error="errors.email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="resetPasswordForm.email"
          placeholder="Enter email"
          name="email"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="resetPasswordForm.password"
          :type="passwordType"
          placeholder="Enter new password"
          name="password"
          tabindex="2"
          @keyup.enter.native="handleResetPassword"
        />
        <span class="show-pwd" @click="showPwd('password')">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item prop="password_confirmation">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordConfirmationType"
          ref="passwordConfirmation"
          v-model="resetPasswordForm.password_confirmation"
          :type="passwordConfirmationType"
          placeholder="Confirm new password"
          name="password_confirmation"
          tabindex="3"
          @keyup.enter.native="handleResetPassword"
        />
        <span class="show-pwd" @click="showPwd('passwordConfirmation')">
          <svg-icon
            :icon-class="
              passwordConfirmationType === 'password' ? 'eye' : 'eye-open'
            "
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        icon="el-icon-circle-check"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleResetPassword"
        >Reset Password</el-button
      >

      <el-link
        type="info"
        class="back-to-login-link"
        @click="$router.push({ name: 'Login' })"
        >Back to login</el-link
      >
    </el-form>
  </div>
</template>

<script>
import { validEmail } from "@/utils/validate";

import { resetPassword } from "@/api/user";

export default {
  name: "ResetPassword",
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The email field is required."));
      } else if (!validEmail(value.trim())) {
        callback(new Error("The email must be a valid email address."));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The password field is required."));
      } else if (value.trim().length < 6) {
        callback(new Error("The password must be at least 6 characters."));
      } else {
        if (this.resetPasswordForm.password_confirmation !== "") {
          this.$refs.resetPasswordForm.validateField("password_confirmation");
        }
        callback();
      }
    };
    const validatePasswordConfirmation = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The password confirmation field is required."));
      } else if (value.trim().length < 6) {
        callback(
          new Error("The password confirmation must be at least 6 characters.")
        );
      } else if (value.trim() !== this.resetPasswordForm.password) {
        callback(new Error("The password confirmation does not match."));
      } else {
        callback();
      }
    };

    return {
      loading: false,

      resetPasswordForm: {
        email: "",
        password: "",
        password_confirmation: "",
        token: ""
      },

      resetPasswordRules: {
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        password_confirmation: [
          {
            required: true,
            trigger: "blur",
            validator: validatePasswordConfirmation
          }
        ]
      },

      errors: {
        email: ""
      },

      passwordType: "password",
      passwordConfirmationType: "password"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.resetPasswordForm.token = route.query && route.query.token;
      },
      immediate: true
    }
  },
  methods: {
    showPwd(field) {
      const data = {
        password: {
          type: "passwordType",
          ref: "password"
        },
        passwordConfirmation: {
          type: "passwordConfirmationType",
          ref: "passwordConfirmation"
        }
      };

      if (this[data[field].type] === "password") {
        this[data[field].type] = "";
      } else {
        this[data[field].type] = "password";
      }
      this.$nextTick(() => {
        this.$refs[data[field].ref].focus();
      });
    },
    handleResetPassword() {
      this.loading = true;

      this.$refs.resetPasswordForm.validate(valid => {
        if (valid) {
          if (!this.resetPasswordForm.token) {
            this.loading = false;

            this.showNotification({
              title: "Error",
              message: "Invalid token provided.",
              type: "error"
            });

            return;
          }

          this.resetErrors();

          resetPassword(this.resetPasswordForm)
            .then(response => {
              this.loading = false;

              this.showNotification({
                title: "Success",
                message: response.data.message,
                type: "success"
              });

              this.$router.push({ name: "Login" });
            })
            .catch(error => {
              this.loading = false;

              return this.catchError(error);
            });
        } else {
          this.loading = false;

          return false;
        }
      });
    },
    resetErrors() {
      this.errors = { email: "" };
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

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .reset-password-form .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.reset-password-form {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.reset-password-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .back-to-login-link {
    float: right;
    font-size: 13px;
    margin-top: -10px;
  }

  .reset-password-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 125px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 24px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
