<template>
  <div>
    <el-form :model="form" status-icon :rules="rules" ref="form" size="small">
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
        @click="
          $emit('toggle-dialog', {
            visibility: false,
            title: null,
            component: null
          })
        "
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
import { updateBasicInformation } from "@/api/group";

export default {
  name: "GroupProfileEditBasicInformation",
  props: ["group"],
  data() {
    var validateName = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The name field is required."));
      } else if (value.trim().length > 255) {
        callback(
          new Error("The first name must not be greater than 255 characters.")
        );
      } else {
        callback();
      }
    };

    return {
      loading: false,

      form: {
        id: null,
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

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.resetErrors();

          this.handleEdit();
        } else {
          this.loading = false;

          return false;
        }
      });
    },
    resetErrors() {
      this.errors = { name: "" };
    },
    handleEdit() {
      updateBasicInformation(this.form, this.form.id)
        .then(response => {
          this.loading = false;

          this.$emit("toggle-dialog", {
            visibility: false,
            title: null,
            component: null
          });

          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-group");
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
    group: {
      handler: function(value) {
        if (value) {
          const { id, name } = value;

          this.form = {
            id,
            name
          };
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
div.dialog-footer {
  text-align: right;
}
</style>
