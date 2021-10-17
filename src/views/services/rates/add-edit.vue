<template>
  <div>
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="rateForm"
      size="small"
    >
      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="Enter rate name"
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
        :loading="requestLoading"
        @click="save"
        >Save</el-button
      >
    </div>
  </div>
</template>

<script>
import { store as _ratesStore, update as _ratesUpdate } from "@/api/rate";

export default {
  name: "RatesAddEdit",
  props: ["type", "form", "requestLoading"],
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
      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }]
      },
      errors: {
        name: ""
      }
    };
  },
  methods: {
    handleAdd() {
      _ratesStore(this.form)
        .then(response => {
          this.$emit("set-request-loading", false);

          this.toggleDialog();

          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-all-rates");
        })
        .catch(error => {
          this.$emit("set-request-loading", false);

          return this.catchError(error);
        });
    },
    handleEdit() {
      _ratesUpdate(this.form, this.form.id)
        .then(response => {
          this.$emit("set-request-loading", false);

          this.toggleDialog();

          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-all-rates");
        })
        .catch(error => {
          this.$emit("set-request-loading", false);

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
    save() {
      this.$emit("set-request-loading", true);

      this.$refs["rateForm"].validate(valid => {
        if (valid) {
          this.resetErrors();

          if (this.type == "add") {
            this.handleAdd();
          } else if (this.type == "edit") {
            this.handleEdit();
          }
        } else {
          this.$emit("set-request-loading", false);

          return false;
        }
      });
    },
    toggleDialog() {
      this.$emit("toggle-dialog", {
        visibility: false,
        title: null,
        type: null
      });
    },
    showInlineErrors(errors) {
      for (var key in errors) {
        this.errors[key] = errors[key][0];
      }
    },
    resetErrors() {
      this.errors = { name: "" };
    }
  }
};
</script>

<style lang="scss" scoped>
div.dialog-footer {
  text-align: right;
}
</style>
