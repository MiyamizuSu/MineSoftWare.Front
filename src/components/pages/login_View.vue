<template>
  <div id="container">
    <el-container>
      <el-header style="padding-left: 0; padding-right: 0;">
        <div class="logoContainer">
          <div style="margin-left: 70px;display: flex">
            <img class="mLogo" src="../resource/MygoS.png">
            <div style="margin-top: 20px">
              <label style="vertical-align: center;color: white">测盟汇管理系统</label>
            </div>
          </div>
        </div>
      </el-header>
      <el-main style="height: 868px">
        <div class="loginContainer" style="border-radius: 30px;border:solid thin gray;background: white">
          <div class="loginHeader" style="margin-top: 30px">
            <div class="logoContainerH" style="margin-left: 25%;">
              <img class="mLogoG" src="../resource/MygoS.png">
              <label style="text-align: center;font-weight:20;"> 求求你看看测盟汇吧，我什么都会做的 </label>
            </div>
          </div>
          <div class="loginContent">
            <div class="buttonGroup" style="margin-bottom: 30px">
              <el-button id="signupBtn" round size="large" @click="RegisterHandle()">
                注册账号
              </el-button>
              <el-button id="loginBtn" round size="large" @click="LoginHandle()">
                登录
              </el-button>
            </div>
            <Transition mode="out-in" name="el-fade-in-linear">
              <div v-if="isChooseMode==='2'" key="login" class="inputGroup" style="margin-bottom: 50px">
                <el-input v-model="userMessageL.userCompany" class="messageInput" placeholder="请输入企业名称"
                          size="large" style="width: 400px;"></el-input>
                <el-input v-model="userMessageL.userName" class="messageInput" placeholder="请输入账号" size="large"
                          style="margin-top: 20px; width: 400px;"></el-input>
                <el-input v-model="userMessageL.userPassword" class="messageInput" placeholder="请输入密码"
                          show-password size="large" style="margin-top: 20px; width: 400px;"></el-input>
                <el-checkbox v-model="checked" class="checkBoxP">
                  我已阅读并同意《测盟汇隐私协议》,《测盟汇支付协议》
                </el-checkbox>
              </div>
              <div v-else-if="isChooseMode==='3'" key="register" class="inputGroup" style="margin-bottom: 50px">
                <el-input v-model="userMessageR.userName" class="messageInput"
                          placeholder="请输入账号昵称" size="large" style="width: 400px;"></el-input>
                <el-input v-model="userMessageR.userPassword" class="messageInput" placeholder="请输入密码"
                          show-password
                          size="large" style="margin-top: 20px;width: 400px;"></el-input>
                <el-input v-model="userMessageR.companyName" class="messageInput" placeholder="请输入企业名称"
                          size="large" style="margin-top: 20px;width: 400px;"></el-input>
                <el-input v-model="userMessageR.companyPhoneNumber" class="messageInput" placeholder="请输入手机号"
                          size="large" style="margin-top: 20px;width: 400px;"></el-input>
                <div>
                  <el-input v-model="userMessageR.token" class="messageInput" placeholder="请输入验证码"
                            size="large" style="margin-top: 20px;width: 300px;"></el-input>
                  <el-button size="large" style="margin-top: 20px;margin-left: 10px" @click.prevent="getToken">
                    获取验证码
                  </el-button>
                </div>
                <el-checkbox v-model="checked" class="checkBoxP">
                  我已阅读并同意《Mygo隐私协议》,《Mygo支付协议》
                </el-checkbox>
              </div>
            </Transition>
          </div>
          <div class="loginFooter">
          </div>
        </div>
      </el-main>
      <el-footer style="height: 30px;background: black;background-image: none">
        <div class="CopyrightContainer">
          <label>
            Copyright © 2024 Mygo Inc. All rights reserved.
          </label>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>

</style>
<script lang="ts">
import axios from "axios";
import {ref} from "vue";
import {ElMessage} from "element-plus";

var useMode = {
  normal: "1",
  login: "2",
  register: "3",
}
export default {
  // 组合式API部分，存放非数据变量
  setup() {
    const checked = ref(false)
    const isChooseMode = ref("0")
    // 返回值会暴露给模板和其他的选项式 API 钩子
    return {
      checked, isChooseMode
    }

  },
  // 选项式API部分，存放实体数据变量
  data() {
    return {
      userMessageL: {
        userCompany: "",
        userName: "",
        userPassword: "",
      },
      userMessageR: {
        userName: "",
        userPassword: "",
        companyName: "",
        companyPhoneNumber: "",
        token: "",
      }
    }
  },
  methods: {
    LoginHandle() {
      if (this.isChooseMode !== useMode.login) {
        this.isChooseMode = useMode.login;
      } else if (!this.checked) {

      } else {
        axios.post("http://localhost:8080/user/login", this.userMessageL, {
          withCredentials: true
        }).then(res => {
          if (res.status == 200) {
            if (res.data.statusCode === "200") {
              ElMessage({
                message: '登录成功',
                grouping: true,
                type: 'success',
              })
            } else if (res.data.statusCode === "302") {
              ElMessage({
                message: '账号/密码错误',
                grouping: true,
                type: 'error',
              })
            }
          } else {
            console.log("Yes")
          }
        })
      }
    },
    RegisterHandle() {
      if (this.isChooseMode !== useMode.register) {
        this.isChooseMode = useMode.register
      } else if (!this.checked) {

      } else {
        axios.post("http://localhost:8080/user/register", this.userMessageR, {
          withCredentials: true
        }).then(res => {
          if (res.status == 200) {
            if (res.data.statusCode === "200") {
              ElMessage({
                message: '注册成功',
                grouping: true,
                type: 'success',
              })
            } else if (res.data.statusCode === "301") {
              ElMessage({
                message: '注册名称重复',
                grouping: true,
                type: 'error',
              })
            } else {
              ElMessage({
                message: '注册失败',
                grouping: true,
                type: 'success',
              })
            }
          }

        })
      }
    },
    getToken() {
      if (!this.checked) {
        ElMessage({
          message: '请勾选同意协议',
          grouping: true,
          type: 'info',
        })
      } else {
        axios.post("http://localhost:8080/user/token", this.userMessageR, {
          withCredentials: true
        }).then(res => {
          if (res.status == 200) {
            console.log(res)
            ElMessage({
              message: '验证码已发送',
              grouping: true,
              type: 'success',
            })
          } else {
            console.log("ERROR")
          }
        })
      }
    },
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
  }
}
</script>
