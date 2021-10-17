<template>
  <div>
    <accounts-header :title="title" @go-to-accounts="goToAccounts" />

    <accounts-form
      :type="type"
      :loading="loading"
      :title="title"
      :form="form"
      :errors="errors"
      @set-loading="setLoading"
      @save="save"
      @show-notification="showNotification"
      @scroll-to-top="scrollToTop"
      @reset-errors="resetErrors"
      @update-form-fields="updateFormFields"
      @go-to-accounts="goToAccounts"
    />
  </div>
</template>

<script>
import AccountsHeader from "./header.vue";
import AccountsForm from "./form.vue";

import { store } from "@/api/user";

export default {
  name: "AccountsAdd",
  data() {
    return {
      type: "add",

      loading: false,

      title: "Add New Account",

      form: {
        first_name: "",
        last_name: "",
        email: "",
        use_default_password: true,
        password: "",
        password_confirmation: "",
        contact_number: "",
        gender: "Male"
      },

      errors: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        contact_number: ""
      }
    };
  },
  methods: {
    save(data) {
      store(data)
        .then(response => {
          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.goToAccounts();
        })
        .catch(error => {
          this.setLoading(false);

          this.scrollToTop();

          this.showNotification({
            title: "Error",
            message: "Please check your inputs.",
            type: "error"
          });

          return this.catchError(error);
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
    },
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    resetErrors() {
      this.errors = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        contact_number: ""
      };
    },
    goToAccounts() {
      this.$router.push({ name: "Accounts" });
    },
    setLoading(isLoading) {
      this.loading = isLoading;
    },
    updateFormFields(data) {
      for (var key in data) {
        this.form[key] = data[key];
      }
    }
  },
  components: {
    AccountsHeader,
    AccountsForm
  }
};
</script>
