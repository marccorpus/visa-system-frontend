<template>
  <div id="services-page">
    <el-card shadow="never" class="the-header" :body-style="bodyStyle">
      <el-row>
        <el-col :span="1">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            @click="refresh"
          ></el-button>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-input
            size="small"
            placeholder="Search"
            prefix-icon="el-icon-search"
            v-model="search"
          ></el-input>
        </el-col>
        <el-col :span="6" :offset="10">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            class="add-btn"
            @click="$router.push({ name: 'ServicesAdd' })"
            >Add New Service</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" :body-style="bodyStyle">
      <el-table
        :data="
          services.filter(
            service =>
              !search ||
              service.name.toLowerCase().includes(search.trim().toLowerCase())
          )
        "
        ref="servicesTable"
        @expand-change="expandChange"
        :row-key="getRowKeys"
        :row-class-name="tableRowClassName"
        :header-cell-style="headerCellStyle"
        v-loading="loading"
        style="width: 100%;"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <services-info :service="scope.row" :rates="rates" />
          </template>
        </el-table-column>
        <el-table-column label="Service Name" prop="name">
          <template slot-scope="scope">
            <span
              :class="{
                disabled: scope.row.deleted_at,
                'parent-service': !('parent_service_id' in scope.row)
              }"
            >
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Processing Time" align="center">
          <template slot-scope="scope" v-if="'processing_type' in scope.row">
            <span v-if="scope.row.processing_type == 'same day'">
              {{ scope.row.processing_type }}
            </span>
            <span v-else-if="scope.row.processing_type == 'fix'">
              {{ scope.row.processing_days }} Day{{
                scope.row.processing_days > 1 ? "s" : ""
              }}
            </span>
            <span v-else-if="scope.row.processing_type == 'range'">
              {{ scope.row.processing_minimum_days }}-{{
                scope.row.processing_maximum_days
              }}
              Days
            </span>
            <span v-else>N/A</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center">
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              size="mini"
              :type="scope.row.deleted_at ? 'danger' : 'success'"
              >{{ scope.row.deleted_at ? "Inactive" : "Active" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center">
          <template slot-scope="scope">
            <el-tooltip
              v-if="'parent_service_id' in scope.row"
              class="item"
              effect="dark"
              content="View"
              placement="top"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-view"
                @click="toggleRow(scope.row)"
              ></el-button>
            </el-tooltip>
            <template v-if="!scope.row.deleted_at">
              <el-tooltip
                class="item"
                effect="dark"
                content="Edit"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Delete"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showPrompt('delete', scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
            <template
              v-else-if="
                (!('parent_service_id' in scope.row) && scope.row.deleted_at) ||
                  ('parent_service_id' in scope.row &&
                    scope.row.deleted_at &&
                    !scope.row.parent.deleted_at)
              "
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="Restore"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-refresh-left"
                  @click="showPrompt('restore', scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import ServicesInfo from "./info.vue";
import {
  show as _servicesShow,
  destroy as _servicesDestroy,
  restore as _servicesRestore
} from "@/api/service";

export default {
  name: "ServicesIndex",
  props: ["loading", "services", "rates", "documents"],
  components: {
    ServicesInfo
  },
  data() {
    return {
      search: "",

      prompt: {
        delete: {
          title: "Delete Service",
          message: "Are you sure you want to delete"
        },
        restore: {
          title: "Restore Service",
          message: "Are you sure you want to restore"
        }
      }
    };
  },
  methods: {
    handleDelete(id, type) {
      _servicesDestroy(id, { type })
        .then(response => {
          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-all-services");
        })
        .catch(error => {
          this.$emit("show-notification", {
            title: "Error",
            message: error.response.data.message,
            type: "error"
          });
        });
    },
    handleRestore(id, type) {
      _servicesRestore(id, { type })
        .then(response => {
          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-all-services");
        })
        .catch(error => {
          this.$emit("show-notification", {
            title: "Error",
            message: error.response.data.message,
            type: "error"
          });
        });
    },
    edit(data) {
      const type = !("parent_service_id" in data) ? "parent" : "child";

      this.$router.push({
        name: "ServicesEdit",
        params: { id: data.id },
        query: { type }
      });
    },
    showPrompt(type, data) {
      const { title, message } = this.prompt[type];
      const { id, name } = data;

      this.$confirm(`${message} "${name}"?`, title, {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          const serviceType = !("parent_service_id" in data)
            ? "parent"
            : "child";

          if (type == "delete") {
            this.handleDelete(id, serviceType);
          } else if (type == "restore") {
            this.handleRestore(id, serviceType);
          }
        })
        .catch(() => {});
    },
    refresh() {
      this.search = "";

      this.collapseAllRows();

      this.$emit("get-all-services");
    },
    toggleRow(row) {
      this.$refs.servicesTable.toggleRowExpansion(row);
    },
    collapseAllRows() {
      const table = this.$refs.servicesTable;
      table.tableData.forEach(row => table.toggleRowExpansion(row, false));
    },
    expandChange(clickedRow, expandedRows) {
      const row = expandedRows.find(e => e == clickedRow);

      if (row) {
        const type = "parent_service_id" in row ? "child" : "parent";

        _servicesShow(row.id, { type, withTrashed: 1 })
          .then(response => {
            const selectedService = response.data.data.service;

            this.$emit("update-services", selectedService);
          })
          .catch(() => {});
      }
    },
    getRowKeys(row) {
      return "parent_service_id" in row
        ? "child-" + row.id
        : "parent-" + row.id;
    },
    tableRowClassName({ row, rowIndex }) {
      let arr = [];

      if (!("parent_service_id" in row)) {
        arr.push("parent-row");
      }

      if (row.deleted_at) {
        arr.push("danger-row");
      }

      return arr.join(" ");
    }
  },
  watch: {
    loading(value) {
      this.search = "";
      this.collapseAllRows();
    }
  },
  computed: {
    bodyStyle() {
      return { padding: "10px" };
    },
    headerCellStyle() {
      return { color: "#303133" };
    }
  }
};
</script>

<style lang="scss">
#services-page .el-table .parent-row td:first-child .cell {
  display: none;
}
#services-page .el-table .danger-row {
  background: #fef0f0 !important;
}
#services-page .el-table .parent-row {
  background: #f9f9f9;
}
</style>

<style lang="scss" scoped>
button.add-btn {
  float: right;
}
span.disabled {
  text-decoration: line-through;
}
span.parent-service {
  color: #409eff;
  font-weight: bold;
}
.the-header {
  margin-bottom: 15px;
}
</style>
