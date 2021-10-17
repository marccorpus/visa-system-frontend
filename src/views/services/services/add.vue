<template>
  <div>
    <services-header :title="title" @go-to-services="goToServices" />

    <services-form
      :loading="loading"
      :title="title"
      :parent-services="parentServices"
      :rates="rates"
      :documents="documents"
      :form="form"
      :errors="errors"
      @set-loading="setLoading"
      @save="save"
      @show-notification="showNotification"
      @scroll-to-top="scrollToTop"
      @reset-errors="resetErrors"
      @go-to-services="goToServices"
    />
  </div>
</template>

<script>
import ServicesHeader from "./header.vue";
import ServicesForm from "./form.vue";

import {
  index as _servicesIndex,
  store as _servicesStore
} from "@/api/service";
import { index as _ratesIndex } from "@/api/rate";
import { index as _documentsIndex } from "@/api/document";

export default {
  name: "ServicesAdd",
  data() {
    return {
      loading: false,

      title: "Add New Service",

      parentServices: [],
      rates: [],
      documents: [],

      form: {
        id: null,
        type: null,
        parent_service_id: null,
        name: "",
        processing_type: null,
        processing_days: null,
        processing_minimum_days: null,
        processing_maximum_days: null,
        rates: [],
        documents_to_be_receive: [],
        documents_to_be_release: []
      },

      errors: { name: "" }
    };
  },
  methods: {
    getAllParentServices() {
      _servicesIndex()
        .then(response => {
          this.parentServices = response.data.data.parent_services.filter(
            parentService => !("parent_service_id" in parentService)
          );
        })
        .catch(() => {});
    },
    getAllRates() {
      _ratesIndex()
        .then(response => {
          const temp = response.data.data.rates;

          const arr = temp.filter(t => t.id != 1);
          const defaultRate = temp.find(t => t.id == 1);
          arr.unshift(defaultRate);

          this.rates = arr;

          this.buildRates();
        })
        .catch(() => {});
    },
    getAllDocuments() {
      _documentsIndex()
        .then(response => {
          this.documents = response.data.data.documents;
        })
        .catch(() => {});
    },
    buildRates() {
      this.form.rates = this.rates.map(rate => {
        return {
          id: rate.id,
          name: rate.name,
          cost: 0,
          under: 0,
          charge: 0
        };
      });
    },
    save(data) {
      _servicesStore(data)
        .then(response => {
          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.goToServices();
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
      this.errors = { name: "" };
    },
    goToServices() {
      this.$router.push({ name: "Services" });
    },
    setLoading(isLoading) {
      this.loading = isLoading;
    }
  },
  components: {
    ServicesHeader,
    ServicesForm
  },
  created() {
    this.getAllParentServices();
    this.getAllRates();
    this.getAllDocuments();
  }
};
</script>
