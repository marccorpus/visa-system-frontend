<template>
  <el-row>
    <el-col :span="18">
      <div>
        <el-form
          :model="form"
          ref="customizeAvatarForm"
          size="small"
          label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Circle Color" prop="avatar_circle_color">
                <el-select
                  v-model="form.avatar_circle_color"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="circleColor in circleColors"
                    :key="circleColor.id"
                    :label="circleColor.label"
                    :value="circleColor.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Top Type" prop="avatar_top_type">
                <el-select
                  v-model="form.avatar_top_type"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="topType in topTypes"
                    :key="topType.id"
                    :label="topType.label"
                    :value="topType.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Top Color" prop="avatar_top_color">
                <el-select
                  v-model="form.avatar_top_color"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="topColor in topColors"
                    :key="topColor.id"
                    :label="topColor.label"
                    :value="topColor.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Hair Color" prop="avatar_hair_color">
                <el-select
                  v-model="form.avatar_hair_color"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="hairColor in hairColors"
                    :key="hairColor.id"
                    :label="hairColor.label"
                    :value="hairColor.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="Accessories Type"
                prop="avatar_accessories_type"
              >
                <el-select
                  v-model="form.avatar_accessories_type"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="accessoriesType in accessoriesTypes"
                    :key="accessoriesType.id"
                    :label="accessoriesType.label"
                    :value="accessoriesType.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Eyebrow Type" prop="avatar_eyebrow_type">
                <el-select
                  v-model="form.avatar_eyebrow_type"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="eyebrowType in eyebrowTypes"
                    :key="eyebrowType.id"
                    :label="eyebrowType.label"
                    :value="eyebrowType.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Eye Type" prop="avatar_eye_type">
                <el-select
                  v-model="form.avatar_eye_type"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="eyeType in eyeTypes"
                    :key="eyeType.id"
                    :label="eyeType.label"
                    :value="eyeType.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="Facial Hair Type"
                prop="avatar_facial_hair_type"
              >
                <el-select
                  v-model="form.avatar_facial_hair_type"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="facialHairType in facialHairTypes"
                    :key="facialHairType.id"
                    :label="facialHairType.label"
                    :value="facialHairType.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="Facial Hair Color"
                prop="avatar_facial_hair_color"
              >
                <el-select
                  v-model="form.avatar_facial_hair_color"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="facialHairColor in facialHairColors"
                    :key="facialHairColor.id"
                    :label="facialHairColor.label"
                    :value="facialHairColor.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Mouth Type" prop="avatar_mouth_type">
                <el-select
                  v-model="form.avatar_mouth_type"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="mouthType in mouthTypes"
                    :key="mouthType.id"
                    :label="mouthType.label"
                    :value="mouthType.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Skin Color" prop="avatar_skin_color">
                <el-select
                  v-model="form.avatar_skin_color"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="skinColor in skinColors"
                    :key="skinColor.id"
                    :label="skinColor.label"
                    :value="skinColor.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Clothes Type" prop="avatar_clothes_type">
                <el-select
                  v-model="form.avatar_clothes_type"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="clothesType in clothesTypes"
                    :key="clothesType.id"
                    :label="clothesType.label"
                    :value="clothesType.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Clothes Color" prop="avatar_clothes_color">
                <el-select
                  v-model="form.avatar_clothes_color"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="clothesColor in clothesColors"
                    :key="clothesColor.id"
                    :label="clothesColor.label"
                    :value="clothesColor.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Graphic Type" prop="avatar_graphic_type">
                <el-select
                  v-model="form.avatar_graphic_type"
                  placeholder="Select"
                  class="full-width"
                >
                  <el-option
                    v-for="graphicType in graphicTypes"
                    :key="graphicType.id"
                    :label="graphicType.label"
                    :value="graphicType.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button
            size="small"
            icon="el-icon-circle-close"
            @click="$emit('toggle-dialog', false)"
            >Cancel</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-check"
            :loading="loading"
            @click="save"
            >Save</el-button
          >
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <avataaars
        class="user-avatar"
        :circleColor="form.avatar_circle_color"
        :topType="form.avatar_top_type"
        :topColor="form.avatar_top_color"
        :hairColor="form.avatar_hair_color"
        :accessoriesType="form.avatar_accessories_type"
        :eyebrowType="form.avatar_eyebrow_type"
        :eyeType="form.avatar_eye_type"
        :facialHairType="form.avatar_facial_hair_type"
        :facialHairColor="form.avatar_facial_hair_color"
        :mouthType="form.avatar_mouth_type"
        :skinColor="form.avatar_skin_color"
        :clotheType="form.avatar_clothes_type"
        :clotheColor="form.avatar_clothes_color"
        :graphicType="form.avatar_graphic_type"
      />
    </el-col>
  </el-row>
</template>

<script>
import {
  circleColors,
  topTypes,
  topColors,
  hairColors,
  accessoriesTypes,
  eyebrowTypes,
  eyeTypes,
  facialHairTypes,
  facialHairColors,
  mouthTypes,
  skinColors,
  clothesTypes,
  clothesColors,
  graphicTypes
} from "@/utils/avatar";

import Avataaars from "@/components/Avataaars";
import { customizeAvatar } from "@/api/user";

export default {
  name: "ProfileCustomizeAvatar",
  props: ["user"],
  data() {
    return {
      loading: false,

      circleColors,
      topTypes,
      topColors,
      hairColors,
      accessoriesTypes,
      eyebrowTypes,
      eyeTypes,
      facialHairTypes,
      facialHairColors,
      mouthTypes,
      skinColors,
      clothesTypes,
      clothesColors,
      graphicTypes,

      form: {
        avatar_circle_color: "",
        avatar_top_type: "",
        avatar_top_color: "",
        avatar_hair_color: "",
        avatar_accessories_type: "",
        avatar_eyebrow_type: "",
        avatar_eye_type: "",
        avatar_facial_hair_type: "",
        avatar_facial_hair_color: "",
        avatar_mouth_type: "",
        avatar_skin_color: "",
        avatar_clothes_type: "",
        avatar_clothes_color: "",
        avatar_graphic_type: ""
      }
    };
  },
  methods: {
    save() {
      this.loading = true;

      customizeAvatar(this.form, this.user.id)
        .then(response => {
          this.loading = false;

          this.$emit("toggle-dialog", false);

          this.$store.dispatch("user/getInfo");

          this.$emit("show-notification", {
            title: "Success",
            message: response.data.message,
            type: "success"
          });
        })
        .catch(error => {});
    }
  },
  watch: {
    user: {
      handler: function(value) {
        if (value) {
          const {
            avatarCircleColor,
            avatarTopType,
            avatarTopColor,
            avatarHairColor,
            avatarAccessoriesType,
            avatarEyebrowType,
            avatarEyeType,
            avatarFacialHairType,
            avatarFacialHairColor,
            avatarMouthType,
            avatarSkinColor,
            avatarClothesType,
            avatarClothesColor,
            avatarGraphicType
          } = value.avatar;

          this.form = {
            avatar_circle_color: avatarCircleColor,
            avatar_top_type: avatarTopType,
            avatar_top_color: avatarTopColor,
            avatar_hair_color: avatarHairColor,
            avatar_accessories_type: avatarAccessoriesType,
            avatar_eyebrow_type: avatarEyebrowType,
            avatar_eye_type: avatarEyeType,
            avatar_facial_hair_type: avatarFacialHairType,
            avatar_facial_hair_color: avatarFacialHairColor,
            avatar_mouth_type: avatarMouthType,
            avatar_skin_color: avatarSkinColor,
            avatar_clothes_type: avatarClothesType,
            avatar_clothes_color: avatarClothesColor,
            avatar_graphic_type: avatarGraphicType
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
div.dialog-footer {
  text-align: right;
}
.full-width {
  width: 100%;
}
.user-avatar {
  border-radius: 10px;
}
</style>
