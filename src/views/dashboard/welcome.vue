<template>
  <el-card :body-style="bodyStyle" shadow="never" class="the-card">
    <div class="main">
      <div class="content">
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
      </div>

      <div class="content">
        <span class="greetings"
          >Hello, <span class="user-first-name">{{ firstName }}</span
          >!</span
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import Avataaars from "@/components/Avataaars";

import { mapGetters } from "vuex";

export default {
  name: "DashboardWelcome",
  data() {
    return {
      firstName: "",
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
  computed: {
    ...mapGetters(["user"]),
    bodyStyle() {
      return { padding: "0px" };
    }
  },
  watch: {
    user: {
      handler: function(value) {
        if (value) {
          const { firstName, avatar } = value;

          this.firstName = firstName;

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
  components: {
    Avataaars
  }
};
</script>

<style lang="scss" scoped>
.the-card {
  background-color: transparent;
  border: none;
}
div.main {
  display: table;
}
div.content {
  display: table-cell;
  vertical-align: middle;
}
.user-avatar {
  border-radius: 10px;
  height: 60px;
  width: 60px;
}
span.greetings {
  font-size: 1.5em;
  font-weight: 100;
  margin-left: 10px;
}
span.user-first-name {
  font-weight: bold;
}
</style>
