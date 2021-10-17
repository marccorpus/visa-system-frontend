<template>
  <div id="services-page-documents-table">
    <el-table
      :data="documentsData"
      style="width: 100%"
      class="documents-table"
      :header-cell-style="headerCellStyle"
      :row-style="rowStyle"
    >
      <el-table-column prop="toBeReceive" label="Documents to be Receive">
        <template slot-scope="scope">
          <ul v-if="scope.row.toBeReceive.length != 0">
            <li v-for="receive in scope.row.toBeReceive">{{ receive.name }}</li>
          </ul>
          <span v-else>No document/s available.</span>
        </template>
      </el-table-column>

      <el-table-column prop="toBeRelease" label="Documents to be Release">
        <template slot-scope="scope">
          <ul v-if="scope.row.toBeRelease.length != 0">
            <li v-for="release in scope.row.toBeRelease">{{ release.name }}</li>
          </ul>
          <span v-else>No document/s available.</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ServicesDocumentsTable",
  props: ["service"],
  computed: {
    documentsData() {
      let documentsData = [];

      if ("parent_service_id" in this.service) {
        if ("documents" in this.service) {
          const documents = this.service.documents.filter(
            document => document.deleted_at == null
          );

          const toBeReceive = documents.filter(
            document => document.pivot.type == "to be receive"
          );

          const toBeRelease = documents.filter(
            document => document.pivot.type == "to be release"
          );

          documentsData.push({
            toBeReceive,
            toBeRelease
          });
        }
      }

      return documentsData;
    },
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#FBF3D0" };
    },
    rowStyle() {
      return { backgroundColor: "#FEFCF3" };
    }
  }
};
</script>

<style lang="scss">
#services-page-documents-table .el-table th,
#services-page-documents-table .el-table td {
  padding: 5px 0px;
}
</style>
<style lang="scss" scoped>
.documents-table {
  font-size: 12px;
  margin-top: 20px;
}
</style>
