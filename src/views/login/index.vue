<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
      status-icon
    >
      <div class="title-container">
        <h3 class="title">
          Analytiq Business Consultancy
        </h3>
      </div>

      <el-form-item prop="email" :error="errors.email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="Email"
          name="email"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-form-item prop="password" :error="errors.password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        icon="el-icon-switch-button"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >

      <el-link
        type="info"
        class="forgot-password-link"
        @click="dialogVisible = true"
        >Forgot password?</el-link
      >
    </el-form>

    <el-dialog
      width="40%"
      title="Forgot Password"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <forgot-password
        @validate-email="validateEmail"
        @toggle-dialog="toggleDialog"
        @show-notification="showNotification"
      />
    </el-dialog>
  </div>
</template>

<script>
import { validEmail } from "@/utils/validate";

import ForgotPassword from "./forgot-password.vue";

export default {
  name: "Login",
  components: {
    ForgotPassword
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The email field is required."));
      } else if (!this.validateEmail(value.trim())) {
        callback(new Error("The email must be a valid email address."));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The password field is required."));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        email: "",
        password: ""
      },
      loginRules: {
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      errors: {
        email: "",
        password: ""
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,

      dialogVisible: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;

          this.resetErrors();

          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(error => {
              this.loading = false;

              const { message } = error.response.data;

              if (message) {
                this.showNotification({
                  title: "Error",
                  message: message,
                  type: "error"
                });
              } else {
                const errors = error.response.data.data.errors;

                for (var key in errors) {
                  this.errors[key] = errors[key][0];
                }
              }
            });
        } else {
          return false;
        }
      });
    },
    resetErrors() {
      this.errors = { email: "", password: "" };
    },
    toggleDialog(visibility) {
      this.dialogVisible = visibility;
    },
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    },
    validateEmail(email) {
      return validEmail(email);
    }
  }
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-form .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-form {
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

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .forgot-password-link {
    float: right;
    font-size: 13px;
    margin-top: -10px;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
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
