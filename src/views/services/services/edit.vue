<template>
  <div>
    <services-header :title="title" @go-to-services="goToServices" />

    <services-not-found v-if="notFound" :not-found="notFound" />

    <services-form
      v-else
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
import ServicesNotFound from "./not-found.vue";
import ServicesHeader from "./header.vue";
import ServicesForm from "./form.vue";

import {
  index as _servicesIndex,
  show as _servicesShow,
  update as _servicesUpdate
} from "@/api/service";
import { index as _ratesIndex } from "@/api/rate";
import { index as _documentsIndex } from "@/api/document";

export default {
  name: "ServicesEdit",
  props: ["id"],
  data() {
    return {
      notFound: null,

      loading: false,

      title: "Edit Service",

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

          this.buildForm();
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
    buildForm() {
      const id = this.id;
      const type = this.$route.query.type;

      if (!type || (type != "parent" && type != "child") || !id || isNaN(id)) {
        this.notFound = "Service not found.";
        return;
      }

      _servicesShow(id, { type })
        .then(response => {
          const service = response.data.data.service;

          this.form.id = id;
          this.form.type = type;
          this.form.parent_service_id =
            type == "parent" ? null : service.parent_service_id;
          this.form.name = service.name;

          this.form.processing_type =
            type == "parent" ? null : service.processing_type;
          this.form.processing_days =
            type == "parent" ? null : service.processing_days;
          this.form.processing_minimum_days =
            type == "parent" ? null : service.processing_minimum_days;
          this.form.processing_maximum_days =
            type == "parent" ? null : service.processing_maximum_days;

          this.form.rates = this.rates.map(rate => {
            let tempRate = null;
            let cost = 0;
            let under = 0;
            let charge = 0;

            if ("rates" in service) {
              tempRate = service.rates.find(
                myRate => myRate.pivot.rate_id == rate.id
              );

              if (tempRate) {
                cost = parseFloat(tempRate.pivot.cost);
                under = parseFloat(tempRate.pivot.under);
                charge = parseFloat(tempRate.pivot.charge);
              }
            }

            return {
              id: rate.id,
              name: rate.name,
              cost,
              under,
              charge
            };
          });

          if ("documents" in service) {
            this.form.documents_to_be_receive = service.documents
              .filter(document => document.pivot.type == "to be receive")
              .map(document => document.id);
            this.form.documents_to_be_release = service.documents
              .filter(document => document.pivot.type == "to be release")
              .map(document => document.id);
          }
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
    save(data) {
      _servicesUpdate(data, data.id)
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
    ServicesNotFound,
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
