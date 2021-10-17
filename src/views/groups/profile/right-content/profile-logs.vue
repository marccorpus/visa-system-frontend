<template>
  <div id="groups-visa-profile-logs">
    <el-card :body-style="bodyStyle" shadow="never" class="header-card">
      <el-row>
        <el-col :span="12">
          <span class="legend">Node Legend:</span>
          <span class="legend created-legend">Created/Added</span>
          <span class="legend updated-legend">Updated</span>
          <span class="legend removed-legend">Removed</span>
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
            <div class="change-log" v-if="'old' in log.properties">
              <ul>
                <li v-for="(value, key) in log.properties.old">
                  <span class="key-value">{{ formatKey(key) }}</span>
                  changed from
                  <span class="key-value">{{ formatValue(value) }}</span>
                  to
                  <span class="key-value">
                    {{ formatValue(log.properties.attributes[key]) }}
                  </span>
                </li>
              </ul>
            </div>
            <div class="change-log clients" v-if="'clients' in log.properties">
              <ul v-for="client in log.properties.clients">
                <li>
                  <span class="id-number">ID: {{ client.id }}</span>
                  {{ client.first_name + " " + client.last_name }}
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
import { groupProfileLogs } from "@/api/activity_log";
import Avataaars from "@/components/Avataaars";
import { humanReadableDateTime } from "@/utils/index";

export default {
  name: "GroupsProfileLogs",
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

      groupProfileLogs({ page: this.page }, this.$route.params.id)
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
      if (description.includes("created") || description.includes("added")) {
        return "#0bbd87";
      } else if (description.includes("updated")) {
        return "#E6A23C";
      } else if (description.includes("removed")) {
        return "#f56c6c";
      }
    },
    formatKey(val) {
      return val.split("_").join(" ");
    },
    formatValue(val) {
      if (val == null) {
        return "null";
      } else if (typeof val === "object") {
        return val.name;
      } else {
        return val;
      }
    }
  },
  watch: {
    tabClicked(val) {
      if (val == "Profile Logs") {
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
#groups-visa-profile-logs .el-card__header {
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
  .updated-legend {
    color: #e6a23c;
  }
  .removed-legend {
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

    .change-log.clients {
      color: #303133;
      font-weight: bold;

      .id-number {
        font-weight: normal;
        color: #909399;
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
