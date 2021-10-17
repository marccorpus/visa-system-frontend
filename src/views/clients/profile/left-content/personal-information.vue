<template>
  <table>
    <tr>
      <td>Passport Number</td>
      <td>{{ passportNumber }}</td>
    </tr>
    <tr>
      <td>Date of Birth</td>
      <td>{{ dateOfBirth }}</td>
    </tr>
    <tr>
      <td>Nationality</td>
      <td>{{ nationality }}</td>
    </tr>
    <tr>
      <td>Gender</td>
      <td>{{ gender }}</td>
    </tr>
    <tr>
      <td>Civil Status</td>
      <td>{{ civilStatus }}</td>
    </tr>
  </table>
</template>

<script>
import { humanReadableDate } from "@/utils/index";

export default {
  name: "ClientProfilePersonalInformation",
  props: ["client"],
  data() {
    return {
      passportNumber: "",
      dateOfBirth: "",
      nationality: "",
      gender: "",
      civilStatus: ""
    };
  },
  watch: {
    client: {
      handler: function(value) {
        if (value) {
          const {
            passport_number,
            date_of_birth,
            nationality,
            gender,
            civil_status
          } = value;

          this.passportNumber = passport_number;
          this.dateOfBirth = date_of_birth
            ? humanReadableDate(date_of_birth)
            : "N/A";
          this.nationality = nationality ? nationality.name : "N/A";
          this.gender = gender || "N/A";
          this.civilStatus = civil_status || "N/A";
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
