<template>
  <div id="dashboard-page-services">
    <el-card :body-style="theHeaderBodyStyle" class="the-header" shadow="never">
      <el-row>
        <el-col :span="12" class="title">Pending/On Process Services</el-col>
        <el-col :span="12">
          <el-select
            v-model="q"
            placeholder="Select"
            size="mini"
            class="select-input"
            @change="setPage(1)"
          >
            <el-option
              v-for="option in options"
              :key="option.id"
              :label="option.label"
              :value="option.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <el-card :body-style="theMainBodyStyle" class="the-main" shadow="never">
      <el-table
        :data="services"
        :header-cell-style="headerCellStyle"
        :row-style="rowStyle"
        v-loading="loading"
        class="services-table"
      >
        <el-table-column label="Date" width="130">
          <template slot-scope="scope">{{
            humanReadableDate(scope.row.created_at)
          }}</template>
        </el-table-column>
        <el-table-column label="Client">
          <template slot-scope="scope">
            <div class="client-block">
              <el-avatar class="client-avatar" size="small">
                {{
                  scope.row.client.first_name.charAt(0).toUpperCase() +
                    scope.row.client.last_name.charAt(0).toUpperCase()
                }}</el-avatar
              >
              <span class="client-name">
                {{
                  scope.row.client.first_name + " " + scope.row.client.last_name
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Tracking" width="100">
          <template slot-scope="scope">{{
            scope.row.transaction.tracking
          }}</template>
        </el-table-column>
        <el-table-column label="Service">
          <template slot-scope="scope">
            <span class="service-name">{{ scope.row.service.name }}</span>
            <span class="parent-service-name"
              >[{{ scope.row.service.parent_service.name }}]</span
            >
          </template>
        </el-table-column>
        <el-table-column label="Type">
          <template slot-scope="scope">
            {{ scope.row.group ? scope.row.group.name : "Individual" }}
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center" width="110">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status == 'Pending' ? 'danger' : 'warning'"
              size="mini"
              effect="dark"
              class="status-tag"
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" width="80">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="Go to Profile"
              placement="top"
            >
              <i
                class="el-icon-right icon-button"
                @click="
                  $router.push({
                    name: scope.row.group ? 'GroupProfile' : 'ClientProfile',
                    params: {
                      id: scope.row.group
                        ? scope.row.group_id
                        : scope.row.client_id
                    }
                  })
                "
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
      >
      </el-pagination>
    </center>
  </div>
</template>

<script>
import { humanReadableDate } from "@/utils/index";
import { dashboardServices } from "@/api/transaction";

export default {
  name: "DashboardServices",
  data() {
    return {
      q: "Pending/On Process",

      options: [
        { id: 1, label: "Pending/On Process", value: "Pending/On Process" },
        { id: 2, label: "Pending", value: "Pending" },
        { id: 3, label: "On Process", value: "On Process" }
      ],

      total: 0,
      page: 1,
      loading: false,
      services: []
    };
  },
  computed: {
    theHeaderBodyStyle() {
      return { padding: "10px", lineHeight: "1.7" };
    },
    theMainBodyStyle() {
      return { padding: "0px" };
    },
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#FBF3D0" };
    },
    rowStyle() {
      return { backgroundColor: "#FEFCF3" };
    }
  },
  methods: {
    setPage(val) {
      this.page = val;

      this.scrollToTop();

      this.getServices();
    },
    getServices() {
      const data = {
        page: this.page,
        q: this.q
      };

      this.loading = true;

      dashboardServices(data)
        .then(response => {
          const { data, total } = response.data.data.services;

          this.total = total;
          this.services = data;

          this.loading = false;
        })
        .catch(() => {});
    },
    humanReadableDate(val) {
      return humanReadableDate(val);
    },
    scrollToTop(top) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  created() {
    this.getServices();
  }
};
</script>

<style lang="scss" scoped>
#dashboard-page-services {
  .the-header {
    margin-top: 15px;
    border: none;

    .title {
      font-size: 14px;
      margin-top: 3px;
    }
    .select-input {
      float: right;
    }
  }

  .the-main {
    margin-top: 10px;
    border: none;

    .services-table {
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

      .service-name,
      .parent-service-name {
        display: block;
      }
      .parent-service-name {
        font-size: 11px;
      }

      .status-tag {
        font-size: 10px;
      }

      .icon-button {
        font-size: 15px;
        color: #1d8ce0;
        cursor: pointer;
        margin: 0 5px;
      }
    }
  }

  .pagination {
    margin-top: 20px;
  }
}
</style>
