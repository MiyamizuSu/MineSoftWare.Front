<template>
  <el-container>
    <el-header height="40px">
      <div style="display:flex">
        <div style="display:inline-flex;white-space:nowrap;">
          <el-text style="width: max-content"> 课程名称</el-text>
          <el-input placeholder="请输入课程名称" style="margin-left: 5%; "></el-input>
        </div>
        <div style="display:inline-flex;white-space:nowrap; margin-left: 1%" >
          <el-text style="width: max-content"> 课程排序</el-text>
          <el-input placeholder="请输入课程排序" style="margin-left: 5%; "></el-input>
        </div>
        <div style="margin-left: 1%">
          <el-button type="primary" :icon="Search" bg text>搜索</el-button>
          <el-button type="info" :icon="Refresh" bg text> 重置</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div>
        <el-button type="primary" :icon="Plus"     plain > 新增 </el-button>
        <el-button type="success" :icon="Edit"     plain>  修改 </el-button>
        <el-button type="danger"  :icon="Delete"   plain>  删除 </el-button>
        <el-button type="warning" :icon="Download" plain>  导出 </el-button>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
<script   lang="ts" >
import { Edit, Search,Refresh,Plus,Delete,Download } from '@element-plus/icons-vue'
import router from "@/router";
import {ref} from "vue";
import Axios from "axios";
export default {
  // 组合式API部分，存放非数据变量
  setup() {
    return {
      Search,Refresh,Plus,Edit,Delete,Download
    }

  },
  // 选项式API部分，存放实体数据变量
  data() {
    return {
    }
  },
  methods: {

    pass(){

    }
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {

  }
}
</script>