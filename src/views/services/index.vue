<template>
  <el-container>
    <el-main>
      <el-tabs type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="Services">
          <services-index
            :services="services"
            :rates="rates"
            :documents="documents"
            :loading="servicesLoading"
            @get-all-services="getAllServices"
            @update-services="updateServices"
            @show-notification="showNotification"
          />
        </el-tab-pane>
        <el-tab-pane label="Rates">
          <rates-index
            :rates="rates"
            :loading="ratesLoading"
            @get-all-rates="getAllRates"
            @show-notification="showNotification"
          />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import ServicesIndex from "./services/index.vue";
import { index as _servicesIndex } from "@/api/service";

import RatesIndex from "./rates/index.vue";
import { index as _ratesIndex } from "@/api/rate";

import { index as _documentsIndex } from "@/api/document";

export default {
  name: "Services",
  components: { ServicesIndex, RatesIndex },
  data() {
    return {
      rates: [],
      ratesLoading: false,

      services: [],
      servicesLoading: false,

      documents: []
    };
  },
  methods: {
    handleTabClick(tab) {
      if (tab.label == "Services") {
        this.getAllServices();
      } else if (tab.label == "Rates") {
        this.getAllRates();
      }
    },
    getAllServices() {
      this.servicesLoading = true;

      _servicesIndex({ withTrashed: 1 })
        .then(response => {
          const temp = response.data.data.parent_services;

          const arr = [];

          temp.forEach(s1 => {
            let parentService = { ...s1 };
            delete parentService.services;

            arr.push(parentService);

            s1.services.forEach(s2 => {
              s2["parent"] = parentService;
              arr.push(s2);
            });
          });

          this.services = arr;

          this.servicesLoading = false;
        })
        .catch(() => {});
    },
    updateServices(service) {
      let cloneService = { ...service };

      let cloneServices = [...this.services];

      const index = this.services.findIndex(
        s =>
          s.id == service.id &&
          ("parent_service_id" in service
            ? "parent_service_id" in s
            : !("parent_service_id" in s))
      );

      if ("parent_service_id" in service) {
        const parentService = this.services.find(
          s => !("parent_service_id" in s) && s.id == service.parent_service_id
        );

        cloneService["parent"] = parentService;
      }

      cloneServices[index] = cloneService;

      this.services = cloneServices;
    },
    getAllRates() {
      this.ratesLoading = true;

      _ratesIndex({ withTrashed: 1 })
        .then(response => {
          const temp = response.data.data.rates;

          const arr = temp.filter(t => t.id != 1);
          const defaultRate = temp.find(t => t.id == 1);
          arr.unshift(defaultRate);

          this.rates = arr;

          this.ratesLoading = false;
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
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    }
  },
  created() {
    this.getAllServices();
    this.getAllRates();
    this.getAllDocuments();
  }
};
</script>
