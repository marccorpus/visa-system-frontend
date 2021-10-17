<template>
  <div>
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="documentForm"
      size="small"
    >
      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="Enter document name"
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
import {
  store as _documentsStore,
  update as _documentsUpdate
} from "@/api/document";

export default {
  name: "DocumentsAddEdit",
  props: ["requestLoading", "type", "form"],
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
      _documentsStore(this.form)
        .then(response => {
          this.$emit("set-request-loading", false);

          this.toggleDialog();

          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-all-documents");
        })
        .catch(error => {
          this.$emit("set-request-loading", false);

          return this.catchError(error);
        });
    },
    handleEdit() {
      _documentsUpdate(this.form, this.form.id)
        .then(response => {
          this.$emit("set-request-loading", false);

          this.toggleDialog();

          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-all-documents");
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

      this.$refs["documentForm"].validate(valid => {
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
