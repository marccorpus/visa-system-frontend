<template>
  <div>
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="clientForm"
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

      <el-form-item
        label="Passport Number"
        prop="passport_number"
        :error="errors.passport_number"
      >
        <el-input
          v-model="form.passport_number"
          autocomplete="off"
          placeholder="Enter Passport Number"
        ></el-input>
      </el-form-item>

      <el-form-item label="Group" prop="group_id">
        <el-select
          v-model="form.group_id"
          placeholder="Select"
          class="full-width"
          filterable
        >
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.name"
            :value="group.id"
          >
          </el-option>
        </el-select>
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
import { store } from "@/api/client";

export default {
  name: "ClientsAdd",
  props: ["groups"],
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

    var validatePassportNumber = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The passport number field is required."));
      } else if (value.trim().length > 100) {
        callback(
          new Error(
            "The passport number must not be greater than 100 characters."
          )
        );
      } else {
        callback();
      }
    };

    return {
      loading: false,

      form: {
        first_name: "",
        last_name: "",
        passport_number: "",
        group_id: null
      },

      rules: {
        first_name: [
          { required: true, validator: validateFirstName, trigger: "blur" }
        ],
        last_name: [
          { required: true, validator: validateLastName, trigger: "blur" }
        ],
        passport_number: [
          { required: true, validator: validatePassportNumber, trigger: "blur" }
        ]
      },
      errors: {
        first_name: "",
        last_name: "",
        passport_number: ""
      }
    };
  },
  methods: {
    save() {
      this.loading = true;

      this.$refs["clientForm"].validate(valid => {
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
      this.errors = { first_name: "", last_name: "", passport_number: "" };
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
            name: "ClientProfile",
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
.full-width {
  width: 100%;
}
</style>
