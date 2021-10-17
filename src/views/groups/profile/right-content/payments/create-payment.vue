<template>
  <div>
    <el-form :model="form" status-icon :rules="rules" ref="form" size="small">
      <el-form-item label="Amount" prop="amount">
        <el-input
          v-model.number="form.amount"
          autocomplete="off"
          placeholder="Enter amount"
        ></el-input>
      </el-form-item>

      <el-form-item label="Note" prop="note">
        <el-input
          v-model="form.note"
          autocomplete="off"
          placeholder="Enter note"
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
  name: "GroupsPaymentsExpandCreatePayment",
  props: ["transactionId"],
  data() {
    var validateAmount = (rule, value, callback) => {
      if (value < 1) {
        callback(new Error("The amount field must be at least 1."));
      } else {
        callback();
      }
    };

    return {
      loading: false,

      form: {
        transaction_id: null,
        amount: "",
        note: null
      },

      rules: {
        amount: [
          {
            type: "number",
            message: "The amount must be digits."
          },
          { required: true, validator: validateAmount, trigger: "blur" }
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

          this.$emit("create-payment", this.form);
        } else {
          this.loading = false;

          return false;
        }
      });
    }
  },
  watch: {
    transactionId: {
      handler: function(value) {
        if (value) {
          this.form.transaction_id = value;
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
