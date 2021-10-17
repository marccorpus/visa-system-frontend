<template>
  <div>
    <el-card :body-style="bodyStyle">
      <div slot="header" class="clearfix">
        <span>Avatar</span>
      </div>

      <center>
        <avataaars
          class="user-avatar"
          :circleColor="avatar.avatarCircleColor"
          :topType="avatar.avatarTopType"
          :topColor="avatar.avatarTopColor"
          :hairColor="avatar.avatarHairColor"
          :accessoriesType="avatar.avatarAccessoriesType"
          :eyebrowType="avatar.avatarEyebrowType"
          :eyeType="avatar.avatarEyeType"
          :facialHairType="avatar.avatarFacialHairType"
          :facialHairColor="avatar.avatarFacialHairColor"
          :mouthType="avatar.avatarMouthType"
          :skinColor="avatar.avatarSkinColor"
          :clotheType="avatar.avatarClothesType"
          :clotheColor="avatar.avatarClothesColor"
          :graphicType="avatar.avatarGraphicType"
        />

        <br />
        <el-button type="text" size="mini" @click="toggleDialog(true)"
          >Customize Avatar</el-button
        >

        <h4>{{ firstName + " " + lastName }}</h4>
        <h5 class="role-name">{{ roleName }}</h5>
      </center>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      title="Customize Avatar"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
      :fullscreen="true"
    >
      <customize-avatar
        :user="user"
        @toggle-dialog="toggleDialog"
        @show-notification="data => $emit('show-notification', data)"
      />
    </el-dialog>
  </div>
</template>

<script>
import Avataaars from "@/components/Avataaars";
import CustomizeAvatar from "./customize-avatar.vue";

export default {
  name: "ProfileLeftContent",
  data() {
    return {
      dialogVisible: false,

      firstName: "",
      lastName: "",
      roleName: "",
      avatar: {
        avatarCircleColor: "",
        avatarTopType: "",
        avatarTopColor: "",
        avatarHairColor: "",
        avatarAccessoriesType: "",
        avatarEyebrowType: "",
        avatarEyeType: "",
        avatarFacialHairType: "",
        avatarFacialHairColor: "",
        avatarMouthType: "",
        avatarSkinColor: "",
        avatarClothesType: "",
        avatarClothesColor: "",
        avatarGraphicType: ""
      }
    };
  },
  props: ["user"],
  computed: {
    bodyStyle() {
      return { padding: "10px" };
    }
  },
  watch: {
    user: {
      handler: function(value) {
        if (value) {
          const { firstName, lastName, avatar, role } = value;

          this.firstName = firstName;
          this.lastName = lastName;
          this.roleName = role.name;

          this.avatar = {
            avatarCircleColor: avatar.avatarCircleColor,
            avatarTopType: avatar.avatarTopType,
            avatarTopColor: avatar.avatarTopColor,
            avatarHairColor: avatar.avatarHairColor,
            avatarAccessoriesType: avatar.avatarAccessoriesType,
            avatarEyebrowType: avatar.avatarEyebrowType,
            avatarEyeType: avatar.avatarEyeType,
            avatarFacialHairType: avatar.avatarFacialHairType,
            avatarFacialHairColor: avatar.avatarFacialHairColor,
            avatarMouthType: avatar.avatarMouthType,
            avatarSkinColor: avatar.avatarSkinColor,
            avatarClothesType: avatar.avatarClothesType,
            avatarClothesColor: avatar.avatarClothesColor,
            avatarGraphicType: avatar.avatarGraphicType
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    toggleDialog(visibility) {
      this.dialogVisible = visibility;
    }
  },
  components: {
    Avataaars,
    CustomizeAvatar
  }
};
</script>

<style lang="scss" scoped>
.role-name {
  color: #6c757d;
  font-size: 12px;
  font-weight: 300;
  margin-top: -15px;
}
.user-avatar {
  border-radius: 10px;
}
</style>
