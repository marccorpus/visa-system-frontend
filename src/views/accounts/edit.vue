<template>
  <div>
    <accounts-header :title="title" @go-to-accounts="goToAccounts" />

    <accounts-not-found v-if="notFound" :not-found="notFound" />

    <accounts-form
      v-else
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
      @go-to-accounts="goToAccounts"
    />
  </div>
</template>

<script>
import AccountsNotFound from "./not-found.vue";
import AccountsHeader from "./header.vue";
import AccountsForm from "./form.vue";
import { mapGetters } from "vuex";

import { show, update } from "@/api/user";

export default {
  name: "AccountsEdit",
  props: ["id"],
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    return {
      notFound: null,

      type: "edit",

      loading: false,

      title: "Edit Account",

      form: {
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        gender: "Male"
      },

      errors: {
        first_name: "",
        last_name: "",
        email: "",
        contact_number: ""
      },

      currentlyLoggedInId: null,
      currentlyLoggedInRoleId: null
    };
  },
  methods: {
    save(data) {
      update(data, data.id)
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
    buildForm() {
      if (this.id == this.currentlyLoggedInId) {
        this.$router.push({ name: "Profile" });
        return;
      }

      show(this.id)
        .then(response => {
          const user = response.data.data.user;

          if (this.currentlyLoggedInRoleId != 1 && user.role_id == 1) {
            this.notFound = "Account not found.";

            return;
          }

          const {
            id,
            first_name,
            last_name,
            email,
            contact_number,
            gender
          } = user;

          this.form = {
            id,
            first_name,
            last_name,
            email,
            contact_number: parseInt(contact_number),
            gender
          };
        })
        .catch(error => {
          if ("response" in error) {
            const { status, data } = error.response;

            if (status == 404) {
              this.notFound = data.message;
            }
          }
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
        contact_number: ""
      };
    },
    goToAccounts() {
      this.$router.push({ name: "Accounts" });
    },
    setLoading(isLoading) {
      this.loading = isLoading;
    }
  },
  watch: {
    user: {
      handler: function(value) {
        if (value) {
          const { id, role } = value;

          this.currentlyLoggedInId = id;
          this.currentlyLoggedInRoleId = role.id;
        }
      },
      immediate: true
    }
  },
  components: {
    AccountsNotFound,
    AccountsHeader,
    AccountsForm
  },
  created() {
    this.buildForm();
  }
};
</script>
