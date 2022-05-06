<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "UserForm",
};
</script>

<style></style>
