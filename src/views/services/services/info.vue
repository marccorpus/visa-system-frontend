<template>
  <div>
    <rates-table v-if="!parent" :service="service" :rates="rates" />

    <documents-table v-if="!parent" :service="service" />
  </div>
</template>

<script>
import RatesTable from "./rates-table.vue";
import DocumentsTable from "./documents-table.vue";

export default {
  name: "ServicesInfo",
  props: ["service", "rates"],
  components: {
    RatesTable,
    DocumentsTable
  },
  computed: {
    parent() {
      return !("parent_service_id" in this.service);
    }
  }
};
</script>
