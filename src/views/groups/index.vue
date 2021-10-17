<template>
  <el-container>
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
              placeholder="Search ID/Name (Press Enter)"
              prefix-icon="el-icon-search"
              v-model="search"
              @keyup.enter.native="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="6" :offset="10">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              class="add-btn"
              @click="add"
              >Add New Group</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </el-header>

    <el-main class="the-main">
      <el-row :gutter="20" class="statistics-container">
        <el-col :span="24">
          <el-tag type="info" effect="dark" size="mini" class="statistics-tag">
            Total Balance: {{ totalBalance }}
          </el-tag>
          <el-tag type="info" effect="dark" size="mini" class="statistics-tag">
            Total Collectable: {{ totalCollectable }}
          </el-tag>
        </el-col>
      </el-row>

      <el-card :body-style="bodyStyle">
        <el-table
          :data="groups"
          :header-cell-style="headerCellStyle"
          v-loading="loading"
          stripe
          style="width: 100%;"
        >
          <el-table-column label="ID" width="80" align="center">
            <template slot-scope="scope">
              <span class="id-column">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Name" width="380">
            <template slot-scope="scope">
              <div class="group-block">
                <el-avatar class="avatar" size="medium">
                  {{ scope.row.name.charAt(0).toUpperCase() }}</el-avatar
                >
                <span class="group-name text-muted">{{ scope.row.name }}</span>
                <span class="latest-transaction text-muted"
                  >Latest Service:
                  {{
                    humanReadableDate(
                      scope.row.service_transactions_max_created_at
                    )
                  }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Balance">
            <template slot-scope="scope">{{ getBalance(scope.row) }}</template>
          </el-table-column>
          <el-table-column label="Collectable">
            <template slot-scope="scope">{{
              getCollectable(scope.row)
            }}</template>
          </el-table-column>
          <el-table-column label="Action" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="View"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-view"
                  @click="
                    $router.push({
                      name: 'GroupProfile',
                      params: { id: scope.row.id }
                    })
                  "
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <center>
          <el-pagination
            class="pagination"
            background
            layout="total, prev, pager, next"
            :total="total"
            @current-change="setPage"
            :current-page.sync="page"
          >
          </el-pagination>
        </center>
      </el-card>
    </el-main>

    <el-dialog
      width="40%"
      :visible.sync="visibility"
      title="Add New Group"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <groups-add @toggle-dialog="toggleDialog" />
    </el-dialog>
  </el-container>
</template>

<script>
import { indexPagination, indexStatistics } from "@/api/group";
import { humanReadableDate, moneyFormat } from "@/utils/index";
import GroupsAdd from "./add.vue";

export default {
  name: "Groups",
  data() {
    return {
      loading: false,

      groups: [],

      total: 0,
      page: 1,

      search: "",

      visibility: false,

      totalBalance: null,
      totalCollectable: null
    };
  },
  methods: {
    setPage(val) {
      this.page = val;

      this.getAllGroups();
    },
    getAllGroups() {
      const data = {
        page: this.page
      };

      const search = this.search.trim();
      if (search.length > 0) {
        data["search"] = search;
      }

      this.loading = true;

      indexPagination(data)
        .then(response => {
          const { data, total } = response.data.data.groups;

          this.total = total;
          this.groups = data;

          this.loading = false;

          this.scrollToTop();
        })
        .catch(() => {});
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    handleSearch() {
      this.setPage(1);
    },
    refresh() {
      this.search = "";
      this.setPage(1);
    },
    add() {
      this.toggleDialog(true);
    },
    toggleDialog(visibility) {
      this.visibility = visibility;
    },
    humanReadableDate(val) {
      return val ? humanReadableDate(val) : "No service yet";
    },
    getBalance(data) {
      const { total_service_cost, total_discount, total_amount_paid } = data;

      const totalServiceCost = total_service_cost || 0;
      const totalDiscount = total_discount || 0;
      const totalAmountPaid = total_amount_paid || 0;

      return moneyFormat(
        (
          parseFloat(totalServiceCost) -
          parseFloat(totalDiscount) -
          parseFloat(totalAmountPaid)
        ).toFixed(2)
      );
    },
    getCollectable(data) {
      const {
        total_completed_service_cost,
        total_discount,
        total_amount_paid
      } = data;

      const totalCompletedServiceCost = total_completed_service_cost || 0;
      const totalDiscount = total_discount || 0;
      const totalAmountPaid = total_amount_paid || 0;

      return moneyFormat(
        (
          parseFloat(totalCompletedServiceCost) -
          parseFloat(totalDiscount) -
          parseFloat(totalAmountPaid)
        ).toFixed(2)
      );
    },
    moneyFormat(val) {
      return moneyFormat(parseFloat(val).toFixed(2));
    },
    getStatistics() {
      indexStatistics()
        .then(response => {
          const { totalBalance, totalCollectable } = response.data.data;

          this.totalBalance = this.moneyFormat(totalBalance);
          this.totalCollectable = this.moneyFormat(totalCollectable);
        })
        .catch(() => {});
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
  components: {
    GroupsAdd
  },
  created() {
    this.getAllGroups();

    this.getStatistics();
  }
};
</script>

<style lang="scss" scoped>
button.add-btn {
  float: right;
}
.id-column {
  font-weight: bold;
}
.pagination {
  margin-top: 20px;
}
.statistics-container {
  margin-bottom: 10px;
  .statistics-tag {
    margin-right: 10px;
  }
}
.the-header {
  margin-top: 20px;
}
.the-main {
  margin-top: -15px;
}
.group-block {
  .group-name,
  .latest-transaction {
    display: block;
    margin-left: 50px;
  }

  .group-name {
    font-size: 14px;
    color: #000;
  }

  :after {
    clear: both;
  }

  .avatar {
    background-color: #07bfcb;
    color: #231e39;
    font-size: 13px;
    font-weight: bold;
    float: left;
    margin-top: 5px;
  }

  span {
    font-weight: 500;
    font-size: 11px;
  }
}
</style>
