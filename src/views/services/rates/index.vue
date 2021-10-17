<template>
  <div id="rates-page">
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
            @click="add"
            >Add New Rate</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" :body-style="{ padding: '10px' }">
      <el-table
        :data="
          rates.filter(
            rate =>
              !search ||
              rate.name.toLowerCase().includes(search.trim().toLowerCase())
          )
        "
        :row-class-name="tableRowClassName"
        :header-cell-style="headerCellStyle"
        v-loading="loading"
        style="width: 100%;"
      >
        <el-table-column label="Rate Name" prop="name">
          <template slot-scope="scope">
            <span :class="{ disabled: scope.row.deleted_at }">{{
              scope.row.name
            }}</span>
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
          <template slot-scope="scope" v-if="scope.row.id != 1">
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
            <template v-else>
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

    <el-dialog
      width="40%"
      :visible.sync="dialog.visibility"
      :title="dialog.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <rates-add-edit
        @toggle-dialog="toggleDialog"
        @show-notification="data => this.$emit('show-notification', data)"
        @get-all-rates="$emit('get-all-rates')"
        @set-request-loading="setRequestLoading"
        :type="type"
        :form="form"
        :request-loading="requestLoading"
      />
    </el-dialog>
  </div>
</template>

<script>
import { destroy as _ratesDestroy, restore as _ratesRestore } from "@/api/rate";
import RatesAddEdit from "./add-edit.vue";

export default {
  name: "RatesIndex",
  props: ["loading", "rates"],
  components: { RatesAddEdit },
  data() {
    return {
      requestLoading: false,

      search: "",

      prompt: {
        delete: {
          title: "Delete Rate",
          message: "Are you sure you want to delete"
        },
        restore: {
          title: "Restore Rate",
          message: "Are you sure you want to restore"
        }
      },

      dialog: {
        visibility: false,
        title: null
      },
      type: null,
      form: {
        id: null,
        name: ""
      }
    };
  },
  methods: {
    add() {
      this.form = {
        id: null,
        name: ""
      };

      this.toggleDialog({
        visibility: true,
        title: "Add New Rate",
        type: "add"
      });
    },
    edit(data) {
      const { id, name } = data;

      this.form = {
        id,
        name
      };

      this.toggleDialog({
        visibility: true,
        title: "Edit Rate",
        type: "edit"
      });
    },
    handleDelete(id) {
      _ratesDestroy(id)
        .then(response => {
          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-all-rates");
        })
        .catch(error => {
          this.$emit("show-notification", {
            title: "Error",
            message: error.response.data.message,
            type: "error"
          });
        });
    },
    handleRestore(id) {
      _ratesRestore(id)
        .then(response => {
          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.$emit("get-all-rates");
        })
        .catch(error => {
          this.$emit("show-notification", {
            title: "Error",
            message: error.response.data.message,
            type: "error"
          });
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
          if (type == "delete") {
            this.handleDelete(id);
          } else if (type == "restore") {
            this.handleRestore(id);
          }
        })
        .catch(() => {});
    },
    toggleDialog({ visibility, title, type }) {
      this.dialog = {
        visibility,
        title
      };

      this.type = type;
    },
    refresh() {
      this.search = "";

      this.$emit("get-all-rates");
    },
    setRequestLoading(isLoading) {
      this.requestLoading = isLoading;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.deleted_at) {
        return "danger-row";
      }

      if (rowIndex % 2 != 0) {
        return "odd-row";
      }

      return "";
    }
  },
  watch: {
    loading(value) {
      this.search = "";
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
#rates-page .el-table .danger-row {
  background: #fef0f0;
}
#rates-page .el-table .odd-row {
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
.the-header {
  margin-bottom: 15px;
}
</style>
