<template>
  <div>
    <el-alert title="Warning" type="warning" show-icon :closable="false">
      Adding a member which is currently belong to a group, will automatically
      transfer to this group.
    </el-alert>

    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      size="small"
      class="the-form"
    >
      <el-form-item label="Clients" prop="clients">
        <el-select
          v-model="form.clients"
          placeholder="Select"
          class="full-width"
          filterable
          multiple
        >
          <el-option
            v-for="nonMember in nonMembers"
            :key="nonMember.id"
            :label="nonMember.first_name + ' ' + nonMember.last_name"
            :value="nonMember.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        icon="el-icon-circle-close"
        @click="$emit('set-dialog', false)"
        >Cancel</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-circle-check"
        :loading="addMemberLoading"
        @click="save"
        >Save</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupsAddMember",
  props: ["addMemberLoading", "nonMembers"],
  data() {
    var validateClients = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("The clients field is required."));
      } else {
        callback();
      }
    };

    return {
      rules: {
        clients: [
          { required: true, validator: validateClients, trigger: "change" }
        ]
      },
      form: {
        group_id: null,
        clients: []
      }
    };
  },
  methods: {
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("add-member", this.form);
        }
      });
    }
  },
  created() {
    this.form.group_id = this.$route.params.id;
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
.the-form {
  margin-top: 20px;
}
</style>
