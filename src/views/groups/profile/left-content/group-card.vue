<template>
  <div>
    <div
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0)"
      class="card-container"
    >
      <basic-information :group="group" />
      <el-link
        class="edit-link"
        icon="el-icon-edit"
        :underline="false"
        @click="update('Basic Information')"
        >Edit</el-link
      >

      <div class="information">
        <h6>
          Contact Information
          <el-link
            class="edit-link"
            icon="el-icon-edit"
            :underline="false"
            @click="update('Contact Information')"
          ></el-link>
        </h6>
        <contact-information :group="group" />
      </div>
    </div>

    <el-dialog
      width="40%"
      :visible.sync="dialog.visibility"
      :title="dialog.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <component
        :is="dialog.component"
        :group="group"
        @toggle-dialog="toggleDialog"
        @show-notification="showNotification"
        @get-group="$emit('get-group')"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import BasicInformation from "./basic-information.vue";
import ContactInformation from "./contact-information.vue";

import EditBasicInformation from "./edit-basic-information.vue";
import EditContactInformation from "./edit-contact-information.vue";

export default {
  name: "GroupProfileGroupCard",
  props: ["loading", "group"],
  data() {
    return {
      dialog: {
        visibility: false,
        title: null,
        component: null
      }
    };
  },
  methods: {
    update(name) {
      this.toggleDialog({
        visibility: true,
        title: "Edit " + name,
        component: "Edit" + name.split(" ").join("")
      });
    },
    toggleDialog({ visibility, title, component }) {
      if (!visibility) {
        this.dialog.visibility = visibility;

        setTimeout(() => {
          this.dialog.title = title;
          this.dialog.component = component;
        }, 500);
      } else {
        this.dialog = {
          visibility,
          title,
          component
        };
      }
    },
    showNotification({ title, message, type }) {
      this.$notify({
        title,
        message,
        type,
        duration: 3000
      });
    }
  },
  components: {
    BasicInformation,
    ContactInformation,
    EditBasicInformation,
    EditContactInformation
  }
};
</script>

<style lang="scss" scoped>
h6 {
  margin: 5px 0;
  text-transform: uppercase;
}
.card-container {
  background-color: #304156;
  border-radius: 5px;
  box-shadow: 0px 10px 20px -10px rgba(0, 0, 0, 0.75);
  color: #b3b8cd;
  padding-top: 35px;
  position: relative;
  width: 350px;
  max-width: 100%;
  text-align: center;
}
.information {
  background-color: #2b303a;
  text-align: left;
  padding: 15px 10px;
  margin-top: 30px;
}
.edit-link {
  color: #07bfcb;
  font-size: 12px;
}
.edit-link:hover {
  color: #07bfcb;
}
</style>
