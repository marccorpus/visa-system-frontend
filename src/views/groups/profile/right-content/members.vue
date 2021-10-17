<template>
  <div id="group-profile-members-page">
    <el-card :body-style="bodyStyle" shadow="never" class="header-card">
      <el-row>
        <el-col :span="1">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="refresh"
          ></el-button>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-input
            size="mini"
            placeholder="Search by ID/Name (Press Enter)"
            prefix-icon="el-icon-search"
            v-model="search"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </el-col>
        <el-col :span="6" :offset="10">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            class="add-btn"
            @click="setDialog(true)"
            >Add Member</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card :body-style="bodyStyle" shadow="never" class="table-card">
      <el-table
        :data="members"
        :header-cell-style="headerCellStyle"
        :row-style="rowStyle"
        v-loading="loading"
        class="members-table"
        ref="members-table"
      >
        <el-table-column label="ID" prop="id" width="80" align="center">
        </el-table-column>
        <el-table-column label="Name">
          <template slot-scope="scope">
            <div class="client-block">
              <el-avatar class="client-avatar" size="small">
                {{
                  scope.row.first_name.charAt(0).toUpperCase() +
                    scope.row.last_name.charAt(0).toUpperCase()
                }}</el-avatar
              >
              <span class="client-name">
                {{ scope.row.first_name + " " + scope.row.last_name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Passport Number">
          <template slot-scope="scope">{{
            scope.row.passport_number
          }}</template>
        </el-table-column>
        <el-table-column label="Contact Number">
          <template slot-scope="scope">{{
            scope.row.contact_number ? "+63" + scope.row.contact_number : "N/A"
          }}</template>
        </el-table-column>
        <el-table-column width="80" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="Go to Profile"
              placement="top"
            >
              <i
                class="el-icon-right icon-button"
                @click="goToProfile(scope.row)"
              ></i>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="Remove Member"
              placement="top"
            >
              <i
                class="el-icon-circle-close icon-button icon-cancel"
                @click="removeMember(scope.row)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <center>
      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="total"
        @current-change="setPage"
        :current-page.sync="page"
        :page-size="10"
      >
      </el-pagination>
    </center>

    <el-dialog
      width="50%"
      :visible.sync="dialogVisible"
      title="Add Member"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <add-member
        :add-member-loading="addMemberLoading"
        :non-members="nonMembers"
        @set-dialog="setDialog"
        @add-member="addMember"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  membersPagination,
  addMembers,
  removeMember,
  nonMembers
} from "@/api/group";
import AddMember from "./add-member.vue";

export default {
  name: "GroupsMembers",
  props: ["tabClicked"],
  computed: {
    bodyStyle() {
      return { padding: "0px" };
    },
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#FBF3D0" };
    },
    rowStyle() {
      return { backgroundColor: "#FEFCF3" };
    }
  },
  data() {
    return {
      search: "",

      total: 0,
      page: 1,

      loading: false,
      members: [],

      dialogVisible: false,
      addMemberLoading: false,
      nonMembers: []
    };
  },
  methods: {
    getMembers() {
      const data = {
        page: this.page
      };

      const search = this.search.trim();
      if (search.length > 0) {
        data["search"] = search;
      }

      this.loading = true;

      membersPagination(data, this.$route.params.id)
        .then(response => {
          const { total, data } = response.data.data.members;

          this.total = total;
          this.members = data;

          this.loading = false;
        })
        .catch(() => {});
    },
    getNonMembers() {
      nonMembers(this.$route.params.id)
        .then(response => {
          this.nonMembers = response.data.data.non_members;
        })
        .catch(() => {});
    },
    scrollToTop(top) {
      window.scrollTo({ top, behavior: "smooth" });
    },
    setPage(val) {
      this.page = val;

      const offsetTop = this.$refs["members-table"].$el.offsetTop;
      this.scrollToTop(offsetTop);

      this.getMembers();
    },
    refresh() {
      this.search = "";

      this.page = 1;

      this.getMembers();
    },
    handleSearch() {
      this.page = 1;

      this.getMembers();
    },
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    },
    goToProfile(row) {
      this.$router.push({
        name: "ClientProfile",
        params: {
          id: row.id
        }
      });
    },
    removeMember(row) {
      this.$confirm(
        `Are you sure you want to remove "${row.first_name} ${row.last_name}" from this group?`,
        "Remove Member",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          const data = {
            group_id: this.$route.params.id,
            client_id: row.id
          };

          removeMember(data)
            .then(response => {
              this.showNotification({
                title: "Success",
                message: response.data.message,
                type: "success"
              });

              this.refresh();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    setDialog(visibility) {
      if (visibility) {
        this.getNonMembers();
      }

      this.dialogVisible = visibility;
    },
    addMember(data) {
      this.addMemberLoading = true;

      addMembers(data)
        .then(response => {
          this.addMemberLoading = false;

          this.setDialog(false);

          this.showNotification({
            title: "Success",
            message: response.data.message,
            type: "success"
          });

          this.refresh();
        })
        .catch(error => {});
    }
  },
  components: {
    AddMember
  },
  watch: {
    tabClicked(val) {
      if (val == "Members") {
        this.setPage(1);
      }
    }
  }
};
</script>

<style lang="scss">
#group-profile-members-page .el-table.members-table th,
#group-profile-members-page .el-table.members-table td {
  padding: 5px 0px;
}
</style>
<style lang="scss" scoped>
.header-card {
  border: none;

  button.add-btn {
    float: right;
  }
}
.table-card {
  border: none;
  margin-top: 20px;

  .members-table {
    font-size: 12px;

    .client-block {
      .client-name {
        display: block;
        margin-left: 35px;
        line-height: 3;
      }

      .client-avatar {
        background-color: #07bfcb;
        color: #231e39;
        font-size: 11px;
        font-weight: bold;
        float: left;
        margin-top: 5px;
      }
    }

    .icon-button {
      font-size: 15px;
      color: #1d8ce0;
      cursor: pointer;
      margin: 0 5px;
    }
    .icon-cancel {
      color: #f56c6c;
    }
  }
}
.pagination {
  margin-top: 20px;
}
</style>
