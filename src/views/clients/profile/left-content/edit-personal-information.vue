<template>
  <div>
    <el-form :model="form" status-icon :rules="rules" ref="form" size="small">
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

      <el-form-item label="Date of Birth" prop="date_of_birth">
        <el-date-picker
          class="full-width"
          v-model="form.date_of_birth"
          value-format="yyyy-MM-dd"
          format="MMMM d, yyyy"
          type="date"
          placeholder="Select date"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="Nationality" prop="nationality_id">
        <el-select
          v-model="form.nationality_id"
          placeholder="Select"
          class="full-width"
          filterable
        >
          <el-option
            v-for="nationality in nationalities"
            :key="nationality.id"
            :label="nationality.name"
            :value="nationality.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Gender" prop="gender">
        <el-select
          v-model="form.gender"
          placeholder="Select"
          class="full-width"
          filterable
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

      <el-form-item label="Civil Status" prop="civil_status">
        <el-select
          v-model="form.civil_status"
          placeholder="Select"
          class="full-width"
          filterable
        >
          <el-option
            v-for="civilStatus in civilStatuses"
            :key="civilStatus.id"
            :label="civilStatus.label"
            :value="civilStatus.value"
          >
          </el-option>
        </el-select>
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
import { updatePersonalInformation } from "@/api/client";

export default {
  name: "ClientProfileEditPersonalInformation",
  props: ["client", "nationalities"],
  data() {
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
        id: null,
        passport_number: "",
        date_of_birth: null,
        nationality_id: null,
        gender: null,
        civil_status: null
      },

      rules: {
        passport_number: [
          { required: true, validator: validatePassportNumber, trigger: "blur" }
        ]
      },
      errors: {
        passport_number: ""
      },

      genders: [
        { id: 1, label: "-- Blank --", value: null },
        { id: 2, label: "Male", value: "Male" },
        { id: 3, label: "Female", value: "Female" }
      ],

      civilStatuses: [
        { id: 1, label: "-- Blank --", value: null },
        { id: 2, label: "Single", value: "Single" },
        { id: 3, label: "Married", value: "Married" },
        { id: 4, label: "Widowed", value: "Widowed" },
        { id: 5, label: "Divorced", value: "Divorced" },
        { id: 6, label: "Separated", value: "Separated" }
      ]
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
      this.errors = { passport_number: "" };
    },
    handleEdit() {
      updatePersonalInformation(this.form, this.form.id)
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

          this.$emit("get-client");
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
    client: {
      handler: function(value) {
        if (value) {
          const {
            id,
            passport_number,
            date_of_birth,
            nationality_id,
            gender,
            civil_status
          } = value;

          this.form = {
            id,
            passport_number,
            date_of_birth,
            nationality_id,
            gender,
            civil_status
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
.full-width {
  width: 100%;
}
</style>
