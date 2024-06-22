<template>
  <el-dialog v-model="passwordC" width="400" center draggable>
      <template #header>
        <el-text>修改密码</el-text>
      </template>

      <el-input v-model="newPassword" placeholder="请输入新密码" ></el-input>
    <div style="margin-top:20px " >
    <el-input  placeholder="请输入验证码" style="width:257px;"></el-input>
      <el-button size="default" style="width: 100px; margin-left: 10px">
        获取验证码
      </el-button>
    </div>
    <template #footer>
      <el-button type="danger" @click="handlePassword" > 确认 </el-button>
    </template>
  </el-dialog>
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
              <label style="min-width: 57px"> {{ userMessage.userName }}</label>
              <div style="margin-left: 15px;margin-top: -9px">
                <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <el-avatar :icon="UserFilled"/>
                </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="s">
                        我的信息
                      </el-dropdown-item>
                      <el-dropdown-item command="e">
                        安全中心
                      </el-dropdown-item>
                      <el-dropdown-item command="m">
                        登出
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
    <!--    -->
    <el-main style=" display: flex;padding: 0;height: 865px">
      <el-container v-if="userType==='1'">
        <!--                侧边栏视图部分-->
        <el-aside style="width: 210px;height:100%">
          <div style="height: 100%">
            <el-row style="height: 100%">
              <el-menu class="el-menu-vertical-demo"
                       default-active="0"
                       style="height: 100%"
                       @select="handleSelect"
              >
                <el-menu-item index="0">
                  <template #title>
                    <el-icon>
                      <Grid/>
                    </el-icon>
                    <span>主页</span>
                  </template>
                </el-menu-item>
                <el-menu-item index="1">
                  <template #title>
                    <el-icon>
                      <User/>
                    </el-icon>
                    <span>用户管理</span>
                  </template>
                </el-menu-item>
                <el-menu-item index="2">
                  <el-icon>
                    <Connection/>
                  </el-icon>
                  <span>组织管理</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <el-icon>
                    <MostlyCloudy/>
                  </el-icon>
                  <span>行业动态管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <el-icon>
                    <Notebook/>
                  </el-icon>
                  <span>课程管理</span>
                </el-menu-item>
                <el-menu-item index="5">
                  <el-icon>
                    <ChatLineRound/>
                  </el-icon>
                  <span>会议管理</span>
                </el-menu-item>
              </el-menu>
            </el-row>
          </div>
        </el-aside>
        <el-main>
          <div v-if="nowIndex==='1'">
            <!--
             用户管理前端代码写在这儿\\
             或者单独写成一个组件也行，只要保证样式大小不超出范围即可
             -->
          </div>
          <div v-else-if="nowIndex==='2'">
            <!--
            组织管理前端代码写在这儿\\
            或者单独写成一个组件也行，只要保证样式大小不超出范围即可
            -->
          </div>
          <div v-else-if="nowIndex==='3'">
            <!--            行业动态管理前端代码写在这儿\\
            或者单独写成一个组件也行，只要保证样式大小不超出范围即可
            -->
          </div>
          <div v-else-if="nowIndex==='4'">
            <!--            课程管理管理前端代码写在这儿\\
            或者单独写成一个组件也行，只要保证样式大小不超出范围即可
            -->
          </div>
          <div v-else-if="nowIndex==='5'">
            <!--            会议管理前端代码写在这儿\\
            或者单独写成一个组件也行，只要保证样式大小不超出范围即可
            -->
          </div>
        </el-main>
      </el-container>
    </el-main>
    <el-footer style="border-top: 1px solid #eee;height: 30px;background: black;background-image: none;">
      <div class="CopyrightContainer">
        <label>
          Copyright © 2024 Mygo Inc. All rights reserved.
        </label>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>

</style>
<script lang="ts">
import router from "@/router";
import {UserFilled} from "@element-plus/icons-vue";
import {ref} from "vue";
import {loadingData, type USERDATA} from "@/utilTs/util";
import Axios from "axios";
import {ElMessage} from "element-plus";

export default {
  // 组合式API部分，存放非数据变量
  setup() {
    const userType = ref("1")
    const nowIndex = ref("0")
    const passwordC = ref(false)
    return {
      UserFilled, userType, nowIndex,passwordC
    }
  },
  // 选项式API部分，存放实体数据变量
  data() {
    const defaultData : USERDATA={
      userName: "",
      belongCompany: "",
      userPhoneNumber: "",
      userEmail: "",
      userRealName: "",
      belongDept:"",
      startTime:"",
      admin: true
    }
    return {
      userMessage:defaultData,
      newPassword:"",

    }
  },
  methods: {
    handleCommand(command: string | number | object) {
      if (command === 's') {
        router.push("/userMessageView")
      }
      else if(command==='e'){
        this.passwordC=true;
      }
    },
    toLogin() {
      router.push('/login')
    },
    handleSelect(index: string) {
      this.nowIndex = index;
    },
    handlePassword(){
      const passwordChange={
        newPassword:this.newPassword,
        userPhoneNumber:this.userMessage.userPhoneNumber,
      }
      Axios.post("http://localhost:8080/user/updatePassword",passwordChange,{
        withCredentials:true
      })
      .then(res => {
        console.log(res)
        if (res.status === 200) {
            if (res.data.statusCode === "200") {
              ElMessage({
                message: '修改完成',
                grouping: true,
                type: 'success',
              })
            }
            else{
              ElMessage({
                message: '发生了未知的错误',
                grouping: true,
                type: 'success',
              })
            }
        }
      })
    }
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
    loadingData().then((res)=>{
      this.userMessage=res;
    })
  }
}
</script>