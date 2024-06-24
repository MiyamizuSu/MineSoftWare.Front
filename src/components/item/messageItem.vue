<script lang="ts">
import {defineComponent, ref, watch} from 'vue'

export default defineComponent({
  props: {
    type: String,
    data: {
      type: String,
    }
  },
  name: "messageItem",
  setup(props) {
    const viewData = ref(props.data);
    watch(() => props.data, (newData) => {
      // console.log(newData);
      viewData.value = newData;
    });
    return {
      viewData
    };
  }
});
</script>

<template>
  <div style="display: grid">
    <el-divider content-position="left">
      <el-icon v-if="type==='用户昵称'" ><Avatar /></el-icon>
      <el-icon v-else-if="type==='手机号码'"><Iphone /></el-icon>
      <el-icon v-else-if="type==='用户邮箱'"><MostlyCloudy /></el-icon>
      <el-icon v-else-if="type==='所属部门'"><OfficeBuilding /></el-icon>
      <el-icon v-else-if="type==='所属角色'"><View /></el-icon>
      <el-icon v-else-if="type==='创建日期'"><Calendar /></el-icon>
      {{type}} </el-divider>
    <el-input v-if="type==='用户昵称'||type==='手机号码'||type==='用户邮箱'" placeholder="输入新信息"  v-model="viewData" @input="$emit('someEvent',viewData,type)"> </el-input>
    <el-text v-else>{{data}}</el-text>
  </div>

</template>

<style scoped>

</style>