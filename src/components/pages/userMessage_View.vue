<template>
  <div>
    <el-container style="height:100%">
      <el-page-header :icon="ArrowLeft" @back="handleBack">
        <template #title >
          <span class="text-large font-600 mr-3"> 返回 </span>
        </template>
        <template #content>
          <span class="text-large font-600 mr-3">  </span>
        </template>
      </el-page-header>
      <el-main style="height: 903px">
        <div style="display: inline-flex">
          <div style="margin-right: -10px;z-index: 100;margin-left: 25%;margin-top:5%">
            <el-card class="box-card" style="height: 700px;width: 700px">
              <img src="../resource/userAvater.png" style="object-fit: cover;width: 100%;height: 100%"/>
              <el-input id="fileInput" style="display: none"  type="file" ></el-input>
              <img src="../resource/编辑.png " style="width: 50px;height: 50px;margin-left: 45%">
            </el-card>
          </div>
          <div style="z-index: 0;margin-top: 5%">
            <el-card class="box-card" style="height: 680px;margin-top: 10px;width: 680px; " body-style="padding-top: 0">
              <template #header>
                <div class="card-header">
                  <span>个人信息</span>
                </div>
              </template>
              <div>
                <message-item type="用户名称" :data="userData.userRealName" ></message-item>
                <message-item type="用户昵称"  @someEvent="changeData"  v-model:data="userData.userName" ></message-item>
                <message-item type="手机号码"  @someEvent="changeData"  v-model:data="userData.userPhoneNumber" ></message-item>
                <message-item type="用户邮箱"  @someEvent="changeData"  v-model:data="userData.userEmail" ></message-item>
                <message-item type="所属部门" :data="userData.belongDept" ></message-item>
                <message-item type="所属角色" data="企业管理员" v-if="userData.admin" ></message-item>
                <message-item type="所属角色" data="一般用户" v-else ></message-item>
                <message-item type="创建日期" :data="userData.startTime" ></message-item>
              </div>
              <template #footer>
                <el-button size="large" style="margin-left: 90%"  @click="uploadMessage">
                  确认
                </el-button>
              </template>
            </el-card>
          </div>
        </div>
      </el-main>
      <el-footer style="border-top: 1px solid #eee;height: 30px;background: black;background-image: none;">
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
<script   lang="ts" >
import router from "@/router";
import MessageItem from "@/components/item/messageItem.vue";
import { ArrowLeft } from '@element-plus/icons-vue'
import {loadingData} from "@/utilTs/util";
import type {USERDATA} from "@/utilTs/util";
import Axios from "axios"

export default {
  components: {MessageItem},
  // 组合式API部分，存放非数据变量
  setup() {
    return {
      ArrowLeft
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
      admin: true,
      startTime:"",
      belongDept:""
    }
    return {
      userData :defaultData,
    }
  },
  methods: {
    handleBack(){
      router.push("/mainView")
    },
    uploadMessage(){
      console.log("1111")
      Axios.post("http://localhost:8080/user/updateMessage",this.userData,{
        withCredentials:true
      }).then((res) => {
        console.log(res)
        if (res.status === 200) {
          if (res.data.statusCode === 200) {

          }
        }
      })
    },
    changeData( e : string,k:string){
      if(k==='用户名称'){
        this.userData.userName=k;
      }
      else if(k==='手机号码')
      {
        this.userData.userPhoneNumber=e
      }
      else if(k==='用户邮箱'){
        this.userData.userEmail=e
      }

    }
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
    loadingData().then((res)=>{
      this.userData=res
    })
  }
}
</script>
