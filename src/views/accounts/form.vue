<template>
  <el-container>
    <el-main class="the-main">
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="accountForm"
        label-position="top"
        size="small"
      >
        <el-card :body-style="bodyStyle">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="First Name"
                prop="first_name"
                :error="errors.first_name"
              >
                <el-input
                  v-model="form.first_name"
                  autocomplete="off"
                  placeholder="Enter first name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Last Name"
                prop="last_name"
                :error="errors.last_name"
              >
                <el-input
                  v-model="form.last_name"
                  autocomplete="off"
                  placeholder="Enter last name"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Email" prop="email" :error="errors.email">
                <el-input
                  v-model="form.email"
                  autocomplete="off"
                  placeholder="Enter email"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <template v-if="type == 'add'">
            <div class="spacer-10"></div>

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item prop="use_default_password">
                  <el-checkbox
                    v-model="form.use_default_password"
                    label="Use default Analytiq password"
                    @input="checkboxChange"
                  ></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="Password"
                  prop="password"
                  :error="errors.password"
                >
                  <el-input
                    type="password"
                    v-model="form.password"
                    autocomplete="off"
                    placeholder="Enter password"
                    :disabled="form.use_default_password"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="Confirm Password"
                  prop="password_confirmation"
                  :error="errors.password_confirmation"
                >
                  <el-input
                    type="password"
                    v-model="form.password_confirmation"
                    autocomplete="off"
                    placeholder="Confirm password"
                    :disabled="form.use_default_password"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="Contact Number"
                prop="contact_number"
                :error="errors.contact_number"
              >
                <el-input
                  v-model.number="form.contact_number"
                  autocomplete="off"
                  placeholder="Enter contact number"
                >
                  <template slot="prepend">+63</template></el-input
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Gender" prop="gender">
                <el-select
                  v-model="form.gender"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="gender in genders"
                    :key="gender.id"
                    :label="gender.label"
                    :value="gender.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </el-main>

    <el-footer class="form-footer">
      <el-card :body-style="bodyStyle">
        <el-row>
          <el-col :span="24">
            <el-button
              size="small"
              icon="el-icon-circle-close"
              @click="$emit('go-to-accounts')"
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
          </el-col>
        </el-row>
      </el-card>
    </el-footer>
  </el-container>
</template>

<script>
import { validEmail } from "@/utils/validate";

export default {
  name: "AccountsForm",
  props: ["type", "loading", "title", "form", "errors"],
  data() {
    var validateFirstName = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The first name field is required."));
      } else if (value.trim().length > 100) {
        callback(
          new Error("The first name must not be greater than 100 characters.")
        );
      } else {
        callback();
      }
    };

    var validateLastName = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The last name field is required."));
      } else if (value.trim().length > 100) {
        callback(
          new Error("The last name must not be greater than 100 characters.")
        );
      } else {
        callback();
      }
    };

    var validateEmail = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The email field is required."));
      } else if (!validEmail(value.trim())) {
        callback(new Error("The email must be a valid email address."));
      } else {
        callback();
      }
    };

    var validatePassword = (rule, value, callback) => {
      if (this.form.use_default_password) {
        callback();
      } else {
        if (value.trim() === "") {
          callback(new Error("The password field is required."));
        } else if (value.trim().length < 6) {
          callback(new Error("The password must be at least 6 characters."));
        } else {
          if (this.form.password_confirmation !== "") {
            this.$refs.accountForm.validateField("password_confirmation");
          }
          callback();
        }
      }
    };

    var validatePasswordConfirmation = (rule, value, callback) => {
      if (this.form.use_default_password) {
        callback();
      } else {
        if (value.trim() === "") {
          callback(new Error("The password confirmation field is required."));
        } else if (value.trim().length < 6) {
          callback(
            new Error(
              "The password confirmation must be at least 6 characters."
            )
          );
        } else if (value.trim() !== this.form.password) {
          callback(new Error("The password confirmation does not match."));
        } else {
          callback();
        }
      }
    };

    var validateContactNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("The contact number field is required."));
      } else if (value.toString().length != 10) {
        callback(new Error("The contact number must be 10 digits."));
      } else {
        callback();
      }
    };

    return {
      genders: [
        { id: 1, label: "Male", value: "Male" },
        { id: 2, label: "Female", value: "Female" }
      ],

      rules: {
        first_name: [
          { required: true, validator: validateFirstName, trigger: "blur" }
        ],
        last_name: [
          { required: true, validator: validateLastName, trigger: "blur" }
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        password_confirmation: [
          {
            required: true,
            validator: validatePasswordConfirmation,
            trigger: "blur"
          }
        ],
        contact_number: [
          { required: true, validator: validateContactNumber, trigger: "blur" },
          {
            type: "number",
            message: "The contact number must be 10 digits."
          }
        ],
        gender: [{ required: true, trigger: "blur" }]
      }
    };
  },
  methods: {
    save() {
      this.$emit("set-loading", true);

      this.$refs["accountForm"].validate(valid => {
        if (valid) {
          this.$emit("reset-errors");

          this.$emit("save", this.form);
        } else {
          this.$emit("set-loading", false);

          this.$emit("scroll-to-top");

          this.$emit("show-notification", {
            title: "Error",
            message: "Please check your inputs.",
            type: "error"
          });

          return false;
        }
      });
    },
    checkboxChange(checked) {
      if (checked) {
        this.$emit("update-form-fields", {
          password: "",
          password_confirmation: ""
        });
      }
    }
  },
  computed: {
    bodyStyle() {
      return { padding: "10px" };
    }
  }
};
</script>

<style lang="scss" scoped>
.form-footer {
  margin-bottom: 14px;
  text-align: right;
}
.full-width {
  width: 100%;
}
.spacer-10 {
  height: 10px;
  clear: both;
}
.the-main {
  margin-top: -15px;
  padding-bottom: 12px;
}
</style>
