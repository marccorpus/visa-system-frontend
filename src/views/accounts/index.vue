<template>
  <el-container id="accounts-page">
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
              @click="$router.push({ name: 'AccountsAdd' })"
              >Add New Account</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </el-header>

    <el-main class="the-main">
      <el-card :body-style="bodyStyle">
        <el-table
          :data="
            accounts.filter(
              account =>
                !search ||
                account.name.toLowerCase().includes(search.trim().toLowerCase())
            )
          "
          :row-class-name="tableRowClassName"
          :header-cell-style="headerCellStyle"
          v-loading="loading"
          style="width: 100%;"
        >
          <el-table-column label="Account" width="400">
            <template slot-scope="scope">
              <div class="user-block">
                <avataaars
                  class="user-avatar"
                  :circleColor="scope.row.avatar_circle_color"
                  :topType="scope.row.avatar_top_type"
                  :topColor="scope.row.avatar_top_color"
                  :hairColor="scope.row.avatar_hair_color"
                  :accessoriesType="scope.row.avatar_accessories_type"
                  :eyebrowType="scope.row.avatar_eyebrow_type"
                  :eyeType="scope.row.avatar_eye_type"
                  :facialHairType="scope.row.avatar_facial_hair_type"
                  :facialHairColor="scope.row.avatar_facial_hair_color"
                  :mouthType="scope.row.avatar_mouth_type"
                  :skinColor="scope.row.avatar_skin_color"
                  :clotheType="scope.row.avatar_clothes_type"
                  :clotheColor="scope.row.avatar_clothes_color"
                  :graphicType="scope.row.avatar_graphic_type"
                />
                <span
                  class="user-name"
                  :class="{ disabled: scope.row.deleted_at }"
                  >{{ scope.row.last_name + ", " + scope.row.first_name }}</span
                >
                <span
                  class="email"
                  :class="{ disabled: scope.row.deleted_at }"
                  >{{ scope.row.email }}</span
                >
                <span
                  class="contact-number"
                  :class="{ disabled: scope.row.deleted_at }"
                  >+63{{ scope.row.contact_number }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Role" align="center">
            <template slot-scope="scope">
              <el-tag
                effect="plain"
                size="mini"
                :type="scope.row.role_id == 1 ? '' : 'info'"
                >{{ scope.row.role.name }}</el-tag
              >
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
              <template
                v-if="
                  !scope.row.deleted_at &&
                    (currentlyLoggedInRoleId == 1 ||
                      (currentlyLoggedInRoleId != 1 && scope.row.role_id != 1))
                "
              >
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
                <template v-if="currentlyLoggedInId != scope.row.id">
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
              </template>
              <template
                v-else-if="
                  scope.row.deleted_at &&
                    (currentlyLoggedInRoleId == 1 ||
                      (currentlyLoggedInRoleId != 1 && scope.row.role_id != 1))
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
    </el-main>
  </el-container>
</template>

<script>
import Avataaars from "@/components/Avataaars";
import { index, destroy, restore } from "@/api/user";
import { mapGetters } from "vuex";

export default {
  name: "Accounts",
  data() {
    return {
      loading: false,

      accounts: [],

      search: "",

      prompt: {
        delete: {
          title: "Delete Account",
          message: "Are you sure you want to delete"
        },
        restore: {
          title: "Restore Account",
          message: "Are you sure you want to restore"
        }
      },

      currentlyLoggedInId: null,
      currentlyLoggedInRoleId: null
    };
  },
  methods: {
    getAllAccounts() {
      this.loading = true;

      index({ withTrashed: 1 })
        .then(response => {
          const accounts = response.data.data.users;

          const adminAccounts = accounts.filter(
            account => account.role_id == 1
          );

          const otherAccounts = accounts.filter(
            account => account.role_id != 1
          );

          this.accounts = adminAccounts.concat(otherAccounts);

          this.loading = false;
        })
        .catch(() => {});
    },
    edit(data) {
      if (data.id == this.currentlyLoggedInId) {
        this.$router.push({ name: "Profile" });
      } else {
        this.$router.push({
          name: "AccountsEdit",
          params: { id: data.id }
        });
      }
    },
    handleDelete(id) {
      destroy(id)
        .then(response => {
          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.getAllAccounts();
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
      restore(id)
        .then(response => {
          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.getAllAccounts();
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
    refresh() {
      this.search = "";

      this.getAllAccounts();
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
    },
    user: {
      handler: function(value) {
        if (value) {
          const { id, role } = value;

          this.currentlyLoggedInId = id;
          this.currentlyLoggedInRoleId = role.id;
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["user"]),
    bodyStyle() {
      return { padding: "10px" };
    },
    headerCellStyle() {
      return { color: "#303133" };
    }
  },
  components: {
    Avataaars
  },
  created() {
    this.getAllAccounts();
  }
};
</script>

<style lang="scss">
#accounts-page .el-table .danger-row {
  background: #fef0f0;
}
#accounts-page .el-table .odd-row {
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
.user-block {
  .user-name,
  .email,
  .contact-number {
    display: block;
    margin-left: 50px;
  }

  .user-name {
    font-size: 14px;
    color: #000;
  }

  :after {
    clear: both;
  }

  .user-avatar {
    border-radius: 10px;
    height: 40px;
    width: 40px;
    float: left;
  }

  span {
    font-weight: 500;
    font-size: 11px;
  }
}
</style>
