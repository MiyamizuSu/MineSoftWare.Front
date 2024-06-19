<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props:['type','data'],
  name: "messageItem"

}
)
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
    <el-input v-if="type==='用户昵称'||type==='手机号码'||type==='用户邮箱'" v-model="data" placeholder="输入新信息" > </el-input>
    <el-text v-else>{{data}}</el-text>
  </div>

</template>

<style scoped>

</style>