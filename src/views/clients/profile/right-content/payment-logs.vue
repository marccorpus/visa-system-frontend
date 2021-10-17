<template>
  <div id="clients-visa-payment-logs">
    <el-card :body-style="bodyStyle" shadow="never" class="header-card">
      <el-row>
        <el-col :span="12">
          <span class="legend">Node Legend:</span>
          <span class="legend created-legend">Created</span>
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
                  <span class="key-value">{{
                    log.properties.attributes["transaction"].tracking
                  }}</span>
                </li>
                <li>
                  Amount:
                  <span class="key-value">{{
                    moneyFormat(log.properties.attributes["amount"])
                  }}</span>
                </li>
                <li
                  v-if="
                    log.properties.attributes['note'] &&
                      !log.properties.attributes['deletion_reason']
                  "
                >
                  Note:
                  <span class="key-value">{{
                    log.properties.attributes["note"]
                  }}</span>
                </li>
                <li v-if="log.properties.attributes['deletion_reason']">
                  Deletion Reason:
                  <span class="key-value">{{
                    log.properties.attributes["deletion_reason"]
                  }}</span>
                </li>
              </ul>
            </div>
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
import { clientPaymentLogs } from "@/api/activity_log";
import Avataaars from "@/components/Avataaars";
import { humanReadableDateTime, moneyFormat } from "@/utils/index";

export default {
  name: "ClientsPaymentLogs",
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

      clientPaymentLogs({ page: this.page }, this.$route.params.id)
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
    nodeColor(description) {
      if (description.includes("created")) {
        return "#0bbd87";
      } else if (description.includes("restored")) {
        return "#409EFF";
      } else if (description.includes("cancelled")) {
        return "#F56C6C";
      }
    },
    moneyFormat(val) {
      return moneyFormat(val);
    }
  },
  watch: {
    tabClicked(val) {
      if (val == "Payment Logs") {
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
#clients-visa-payment-logs .el-card__header {
  padding: 10px;
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
  }
}
</style>
