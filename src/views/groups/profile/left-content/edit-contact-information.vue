<template>
  <div>
    <el-form :model="form" status-icon :rules="rules" ref="form" size="small">
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

      <el-form-item label="Address" prop="address">
        <el-input
          v-model="form.address"
          autocomplete="off"
          placeholder="Enter address"
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
import { updateContactInformation } from "@/api/group";

export default {
  name: "GroupProfileEditContactInformation",
  props: ["group"],
  data() {
    var validateContactNumber = (rule, value, callback) => {
      if (value && value.toString().length != 10) {
        callback(new Error("The contact number must be 10 digits."));
      } else {
        callback();
      }
    };

    return {
      loading: false,

      form: {
        id: null,
        contact_number: "",
        address: null
      },

      rules: {
        contact_number: [{ validator: validateContactNumber, trigger: "blur" }]
      },
      errors: {
        contact_number: ""
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
      this.errors = { contact_number: "" };
    },
    handleEdit() {
      updateContactInformation(this.form, this.form.id)
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
          const { id, contact_number, address } = value;

          this.form = {
            id,
            contact_number,
            address
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
