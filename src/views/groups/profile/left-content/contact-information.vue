<template>
  <table>
    <tr>
      <td>Contact Number</td>
      <td>{{ contactNumber }}</td>
    </tr>
    <tr>
      <td>Address</td>
      <td>{{ address }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "GroupProfileContactInformation",
  props: ["group"],
  data() {
    return {
      contactNumber: "",
      address: ""
    };
  },
  watch: {
    group: {
      handler: function(value) {
        if (value) {
          const { contact_number, address } = value;

          this.contactNumber = contact_number ? "+63" + contact_number : "N/A";
          this.address = address || "N/A";
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
table {
  font-size: 11px;
  width: 100%;
}
table tr {
  height: 30px;
}
table tr td:first-child {
  text-align: left;
}
table tr td:last-child {
  text-align: right;
}
</style>
