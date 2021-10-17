<template>
  <div id="groups-visa-transaction-logs">
    <el-card :body-style="bodyStyle" shadow="never" class="header-card">
      <el-row>
        <el-col :span="12">
          <span class="legend">Node Legend:</span>
          <span class="legend created-legend">Created/Added</span>
          <span class="legend updated-legend">Updated</span>
          <span class="legend restored-legend">Restored</span>
          <span class="legend cancelled-legend">Cancelled</span>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            class="refresh-btn"
            @click="setPage(1)"
            >Refresh</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-card
      :body-style="bodyStyle"
      shadow="never"
      class="the-card"
      v-loading="loading"
    >
      <el-timeline>
        <el-timeline-item
          v-for="log in logs"
          :timestamp="humanReadableDateTime(log.created_at)"
          :color="nodeColor(log.description)"
          size="large"
          placement="top"
        >
          <el-card
            :body-style="bodyStyle2"
            shadow="never"
            class="timeline-items-card"
          >
            <div slot="header" class="clearfix">
              <div class="user-block">
                <avataaars
                  class="user-avatar"
                  :circleColor="log.causer.avatar_circle_color"
                  :topType="log.causer.avatar_top_type"
                  :topColor="log.causer.avatar_top_color"
                  :hairColor="log.causer.avatar_hair_color"
                  :accessoriesType="log.causer.avatar_accessories_type"
                  :eyebrowType="log.causer.avatar_eyebrow_type"
                  :eyeType="log.causer.avatar_eye_type"
                  :facialHairType="log.causer.avatar_facial_hair_type"
                  :facialHairColor="log.causer.avatar_facial_hair_color"
                  :mouthType="log.causer.avatar_mouth_type"
                  :skinColor="log.causer.avatar_skin_color"
                  :clotheType="log.causer.avatar_clothes_type"
                  :clotheColor="log.causer.avatar_clothes_color"
                  :graphicType="log.causer.avatar_graphic_type"
                />
                <span class="user-name">{{
                  log.causer.first_name + " " + log.causer.last_name
                }}</span>
              </div>
            </div>
            <div>{{ log.description }}</div>

            <div class="change-log">
              <ul>
                <li>
                  Tracking:
                  <span class="key-value">{{ log.properties.tracking }}</span>
                </li>
                <li v-if="'discount' in log.properties">
                  Discount:
                  <span class="key-value">{{
                    moneyFormat(log.properties.discount)
                  }}</span>
                </li>
                <li v-if="'field' in log.properties">
                  <span class="key-value">{{ log.properties.field }}</span>
                  changed from
                  <span class="key-value">{{
                    moneyFormat(log.properties.old)
                  }}</span>
                  to
                  <span class="key-value">
                    {{ moneyFormat(log.properties.new) }}
                  </span>
                </li>
                <li v-if="'deletion_reason' in log.properties">
                  Deletion Reason:
                  <span class="key-value">{{
                    log.properties.deletion_reason
                  }}</span>
                </li>
              </ul>
            </div>

            <el-table
              v-if="
                log.properties.services && log.properties.services.length > 0
              "
              :data="log.properties.services"
              :header-cell-style="headerCellStyle"
              class="services-table"
            >
              <el-table-column label="Service">
                <template slot-scope="scope">
                  <span class="service-name">
                    {{ scope.row.service_name }}
                  </span>
                  <span class="parent-service-name">
                    [{{ scope.row.parent_service_name }}]
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="Client"
                prop="client_name"
              ></el-table-column>
              <el-table-column label="Service Cost" align="center" width="150">
                <template slot-scope="scope">
                  {{ moneyFormat(scope.row.total_service_cost) }}
                </template>
              </el-table-column>
              <el-table-column label="Status" align="center">
                <template slot-scope="scope">
                  <el-tag
                    v-if="!('deletion_reason' in log.properties)"
                    :type="getStatusTagType(scope.row.status)"
                    size="mini"
                    effect="dark"
                    class="status-tag"
                    >{{ scope.row.status }}</el-tag
                  >
                  <el-tag
                    v-if="'deletion_reason' in log.properties"
                    type="info"
                    size="mini"
                    effect="dark"
                    class="status-tag"
                    >Cancelled</el-tag
                  >

                  <template v-if="'new_status' in scope.row">
                    <i class="el-icon-right icon-button"></i>

                    <el-tag
                      :type="getStatusTagType(scope.row.new_status)"
                      size="mini"
                      effect="dark"
                      class="status-tag"
                      >{{ scope.row.new_status }}</el-tag
                    >
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <center>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          @current-change="setPage"
          :current-page.sync="page"
        >
        </el-pagination>
      </center>
    </el-card>
  </div>
</template>

<script>
import { groupTransactionLogs } from "@/api/activity_log";
import Avataaars from "@/components/Avataaars";
import { moneyFormat, humanReadableDateTime } from "@/utils/index";

export default {
  name: "GroupsTransactionLogs",
  data() {
    return {
      loading: false,
      total: 0,
      page: 1,
      logs: []
    };
  },
  props: ["tabClicked"],
  computed: {
    bodyStyle() {
      return { padding: "0px" };
    },
    bodyStyle2() {
      return { padding: "10px" };
    },
    headerCellStyle() {
      return { color: "#303133", backgroundColor: "#f5f7fa" };
    }
  },
  methods: {
    setPage(val) {
      this.page = val;

      this.scrollToTop();

      this.getLogs();
    },
    scrollToTop(top) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    getLogs() {
      this.loading = true;

      groupTransactionLogs({ page: this.page }, this.$route.params.id)
        .then(response => {
          const { data, total } = response.data.data.logs;

          this.total = total;
          this.logs = data;

          this.loading = false;
        })
        .catch(() => {});
    },
    humanReadableDateTime(dateTime) {
      return humanReadableDateTime(dateTime);
    },
    moneyFormat(val) {
      return val ? moneyFormat(parseFloat(val).toFixed(2)) : "0.00";
    },
    nodeColor(description) {
      if (description.includes("created") || description.includes("added")) {
        return "#0bbd87";
      } else if (description.includes("updated")) {
        return "#E6A23C";
      } else if (description.includes("restored")) {
        return "#409EFF";
      } else if (description.includes("cancelled")) {
        return "#f56c6c";
      }
    },
    getStatusTagType(status) {
      if (status == "Pending") {
        return "danger";
      } else if (status == "On Process") {
        return "warning";
      } else if (status == "Completed") {
        return "";
      } else if (status == "Released") {
        return "success";
      }
    }
  },
  watch: {
    tabClicked(val) {
      if (val == "Transaction Logs") {
        this.setPage(1);
      }
    }
  },
  components: {
    Avataaars
  }
};
</script>

<style lang="scss">
#groups-visa-transaction-logs .el-card__header {
  padding: 10px;
}
#groups-visa-transaction-logs .el-table.services-table th,
#groups-visa-transaction-logs .el-table.services-table td {
  padding: 5px 0px;
}
</style>
<style lang="scss" scoped>
.header-card {
  border: none;

  .legend {
    margin-right: 5px;
    font-size: 12px;
  }
  .created-legend {
    color: #0bbd87;
  }
  .updated-legend {
    color: #e6a23c;
  }
  .restored-legend {
    color: #409eff;
  }
  .cancelled-legend {
    color: #f56c6c;
  }

  button.refresh-btn {
    float: right;
  }
}

.the-card {
  border: none;
  margin-top: 20px;

  .timeline-items-card {
    font-size: 12px;

    .change-log {
      margin-top: 12px;
      color: #909399;

      li {
        margin: 5px 0;

        .key-value {
          font-weight: bold;
          color: #303133;
        }
      }
    }

    .user-block {
      .user-name {
        display: block;
        margin-left: 30px;
        font-size: 12px;
        line-height: 2.5;
      }

      .user-avatar {
        border-radius: 10px;
        height: 28px;
        width: 28px;
        float: left;
      }
    }

    .services-table {
      font-size: 12px;
      margin-top: 20px;

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
}
</style>
