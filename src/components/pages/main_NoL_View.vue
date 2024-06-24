<template>
  <el-container>
    <!--        顶部logo部分-->
    <el-header class="Header" style="padding-left: 0; padding-right: 0;border: 1px solid #eee;height: fit-content">
      <el-row style="height: 60px">
        <el-col :span="20" style="height: 60px">
          <!--一个-col的长度为24SPan-->
          <div class="projectLabelC">
            <label class="projectLabel">测盟汇管理系统</label>
          </div>
        </el-col>
        <el-col :span="4" style="height: 60px">
          <div class="userMessageContainer">
            <div class="usernameContainer">
              <label> 未登录</label>
              <div style="margin-left: 15px;margin-top: -9px">
              <el-dropdown @command="handleCommand" >
                <span class="el-dropdown-link" >
                  <el-avatar :icon="UserFilled" />
                </span>
                <template #dropdown>
                  <el-dropdown-menu >
                    <el-dropdown-item command="l">
                      登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
  </el-container>
</template>
<style scoped>

</style>
<script lang="ts">
import router from "@/router";
import { UserFilled } from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import axios from "axios";

axios.defaults.withCredentials =true;

export default {
  // 组合式API部分，存放非数据变量
  setup() {
    return {
      UserFilled
    }

  },
  // 选项式API部分，存放实体数据变量
  data() {
    return {

    }
  },
  methods: {
    handleCommand(command:string|number|object){
      if(command==='l')
        router.push("/login")
    }
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {

  }
}

</script>