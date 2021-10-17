<template>
  <el-container id="documents-page">
    <el-header class="the-header">
      <el-card :body-style="bodyStyle">
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
              >Add New Document</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </el-header>

    <el-main class="the-main">
      <el-card :body-style="bodyStyle">
        <el-table
          :data="
            documents.filter(
              document =>
                !search ||
                document.name
                  .toLowerCase()
                  .includes(search.trim().toLowerCase())
            )
          "
          :row-class-name="tableRowClassName"
          :header-cell-style="headerCellStyle"
          v-loading="loading"
          style="width: 100%;"
        >
          <el-table-column label="Document Name" prop="name">
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
            <template slot-scope="scope">
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
    </el-main>

    <el-dialog
      width="40%"
      :visible.sync="dialog.visibility"
      :title="dialog.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <documents-add-edit
        @toggle-dialog="toggleDialog"
        @show-notification="showNotification"
        @get-all-documents="getAllDocuments"
        @set-request-loading="setRequestLoading"
        :request-loading="requestLoading"
        :type="type"
        :form="form"
      />
    </el-dialog>
  </el-container>
</template>

<script>
import {
  index as _documentsIndex,
  destroy as _documentsDestroy,
  restore as _documentsRestore
} from "@/api/document";
import DocumentsAddEdit from "./add-edit.vue";

export default {
  name: "Documents",
  components: { DocumentsAddEdit },
  data() {
    return {
      loading: false,
      requestLoading: false,

      documents: [],

      search: "",

      prompt: {
        delete: {
          title: "Delete Document",
          message: "Are you sure you want to delete"
        },
        restore: {
          title: "Restore Document",
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
    getAllDocuments() {
      this.loading = true;

      _documentsIndex({ withTrashed: 1 })
        .then(response => {
          this.documents = response.data.data.documents;

          this.loading = false;
        })
        .catch(() => {});
    },
    add() {
      this.form = {
        id: null,
        name: ""
      };

      this.toggleDialog({
        visibility: true,
        title: "Add New Document",
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
        title: "Edit Document",
        type: "edit"
      });
    },
    handleDelete(id) {
      _documentsDestroy(id)
        .then(response => {
          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.getAllDocuments();
        })
        .catch(error => {
          this.showNotification({
            title: "Error",
            message: error.response.data.message,
            type: "error"
          });
        });
    },
    handleRestore(id) {
      _documentsRestore(id)
        .then(response => {
          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.getAllDocuments();
        })
        .catch(error => {
          this.showNotification({
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
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
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

      this.getAllDocuments();
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
  },
  created() {
    this.getAllDocuments();
  }
};
</script>

<style lang="scss">
#documents-page .el-table .danger-row {
  background: #fef0f0;
}
#documents-page .el-table .odd-row {
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
  margin-top: 20px;
}
.the-main {
  margin-top: -15px;
}
</style>
