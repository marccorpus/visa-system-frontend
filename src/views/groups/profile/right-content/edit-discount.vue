<template>
  <div>
    <el-form :model="form" status-icon :rules="rules" ref="form" size="small">
      <el-form-item label="Discount" prop="discount">
        <el-input
          v-model.number="form.discount"
          autocomplete="off"
          placeholder="Enter discount"
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        icon="el-icon-circle-close"
        @click="
          $emit('toggle-dialog', {
            visibility: false,
            title: null,
            component: null
          })
        "
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
</template>

<script>
export default {
  name: "GroupsEditDiscount",
  props: ["selectedTransaction"],
  data() {
    return {
      loading: false,

      form: {
        id: null,
        discount: 0
      },

      rules: {
        discount: [
          {
            required: true,
            type: "number",
            message: "The discount must be digits."
          }
        ]
      }
    };
  },
  methods: {
    save() {
      this.loading = true;

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = false;

          this.$emit("edit-discount", this.form);
        } else {
          this.loading = false;

          return false;
        }
      });
    }
  },
  watch: {
    selectedTransaction: {
      handler: function(value) {
        if (value) {
          const { id, discount } = value;

          this.form = {
            id,
            discount: parseFloat(discount)
          };
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
div.dialog-footer {
  text-align: right;
}
</style>
