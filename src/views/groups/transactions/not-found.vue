<template>
  <el-alert
    title="Error"
    type="error"
    :description="notFound"
    show-icon
    :closable="false"
    effect="dark"
    style="margin-top: 11px"
  >
  </el-alert>
</template>

<script>
export default {
  name: "GroupCreateTransactionNotFound",
  props: ["notFound"]
};
</script>
