<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
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
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Dashboard
            </el-dropdown-item>
          </router-link>
          <router-link to="/profile">
            <el-dropdown-item>
              Profile
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Avataaars from "@/components/Avataaars";

export default {
  data() {
    return {
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
  components: {
    Breadcrumb,
    Hamburger,
    Avataaars
  },
  computed: {
    ...mapGetters(["sidebar", "user"])
  },
  methods: {
    toggleSideBar() {
      const routeName = this.$route.name;
      if (routeName == "ClientProfile" || routeName == "GroupProfile") {
        this.$alert(
          "Toggling sidebar is not available on this page.",
          "Sidebar Locked",
          {
            confirmButtonText: "OK",
            callback: () => {}
          }
        );

        return;
      }

      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$router.push("/login");
    }
  },
  watch: {
    user: {
      handler: function(value) {
        if (value) {
          const { avatar } = value;

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
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
