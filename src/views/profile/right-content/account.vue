<template>
  <el-form
    :model="form"
    status-icon
    :rules="rules"
    ref="accountForm"
    size="small"
  >
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

    <el-form-item label="Last Name" prop="last_name" :error="errors.last_name">
      <el-input
        v-model="form.last_name"
        autocomplete="off"
        placeholder="Enter last name"
      ></el-input>
    </el-form-item>

    <el-form-item label="Email" prop="email" :error="errors.email">
      <el-input
        v-model="form.email"
        autocomplete="off"
        placeholder="Enter email"
      ></el-input>
    </el-form-item>

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

    <el-form-item label="Gender" prop="gender" :error="errors.gender">
      <el-select v-model="form.gender" placeholder="Select" class="full-width">
        <el-option
          v-for="gender in genders"
          :key="gender.id"
          :label="gender.label"
          :value="gender.value"
        >
        </el-option>
      </el-select>
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
import { validEmail } from "@/utils/validate";
import { update } from "@/api/user";

export default {
  name: "ProfileAccount",
  props: ["user"],
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
      loading: false,

      form: {
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        gender: ""
      },

      rules: {
        first_name: [
          { required: true, validator: validateFirstName, trigger: "blur" }
        ],
        last_name: [
          { required: true, validator: validateLastName, trigger: "blur" }
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        contact_number: [
          { required: true, validator: validateContactNumber, trigger: "blur" },
          {
            type: "number",
            message: "The contact number must be 10 digits."
          }
        ],
        gender: [{ required: true, trigger: "blur" }]
      },

      errors: {
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        gender: ""
      },

      genders: [
        { id: 1, label: "Male", value: "Male" },
        { id: 2, label: "Female", value: "Female" }
      ]
    };
  },
  methods: {
    resetErrors() {
      this.errors = {
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        gender: ""
      };
    },
    save() {
      this.loading = true;

      this.$refs["accountForm"].validate(valid => {
        if (valid) {
          this.resetErrors();

          this.update();
        } else {
          this.loading = false;

          return false;
        }
      });
    },
    update() {
      update(this.form, this.form.id)
        .then(response => {
          this.loading = false;

          this.$store.dispatch("user/getInfo");

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
          const {
            id,
            firstName,
            lastName,
            email,
            contactNumber,
            gender
          } = value;

          this.form = {
            id,
            first_name: firstName,
            last_name: lastName,
            email,
            contact_number: parseInt(contactNumber),
            gender
          };
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.full-width {
  width: 100%;
}
.pull-right {
  float: right;
}
</style>
