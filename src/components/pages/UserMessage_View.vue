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
          <div style="margin-right: -10px;z-index: 100;margin-left: 17%;margin-top:5%">
            <el-card class="box-card" style="height: 700px;width: 700px">
              <img :src="userData.imgUrl" style="object-fit: cover;max-width: 95%;max-height: 60% "/>
              <el-upload :http-request="httpRequest" style="margin-left:40%" show-file-list :crossorigin="'use-credentials'">
                <view slot="trigger" >
                  <img src="../resource/编辑.png " style="width: 50px;height: 50px;margin-left: 45%" >
                </view>
              </el-upload>

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
                <message-item type="所属角色" data="企业管理员" v-if="userData.userType==1" ></message-item>
                <message-item type="所属角色" data="一般用户" v-else-if="userData.userType==0" ></message-item>
                <message-item type="所属角色" data="超级管理员" v-else-if="userData.userType==2" ></message-item>
                <message-item type="创建日期" :data="userData.startTime" ></message-item>
              </div>
              <template #footer>
                <el-button size="large" type="success" style="margin-left: 45%"  @click="uploadMessage" >
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
import MessageItem from "@/components/diyComponents/messageItem.vue";
import { ArrowLeft } from '@element-plus/icons-vue'
import {loadingData,uploadFile} from "@/utilTs/util";
import type {USERDATA} from "@/utilTs/util";
import Axios from "axios"
import {ElMessage, type UploadFile, type UploadFiles, type UploadRequestOptions} from "element-plus";
import {defaultAvatar} from '@/utilTs/util'
import mitt from 'mitt'
import {ref} from "vue";

Axios.defaults.withCredentials =true;
const emitter = mitt()

export default {
  components: {MessageItem},
  // 组合式API部分，存放非数据变量
  setup() {
    const defaultUrl=ref(defaultAvatar);
    //
    const httpRequest =(options: UploadRequestOptions ) : void=>{
      const fileTo=options.file
      uploadFile(fileTo).then(res=>{
        console.log(res.data.data.links.url)
        emitter.emit('urlChange',res.data.data.links.url);
      })
    };
    return {
      ArrowLeft,defaultUrl,httpRequest
    }

  },
  // 选项式API部分，存放实体数据变量
  data() {
    //既然前端把企业用户和超级管理员视作同一类型，后端就也应该用同一个类
    const defaultData : USERDATA={
      userName: "",
      userRealName: "",
      userPhoneNumber: "",
      userEmail: "",
      imgUrl: "",
      userType: -1,
      belongCompany: "",
      belongDept: "",
      startTime: "",
    }
    function handleSuccess(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles){
      console.log(uploadFiles)

    }
    return {
      userData :defaultData,
      handleSuccess,
    }
  },
  methods: {
    handleBack(){
      router.push("/mainView")
    },
    uploadMessage(){
      console.log("1111");
      console.log(this.userData.userName);
      Axios.post("http://localhost:8080/user/updateMessage",this.userData,{
        withCredentials:true
      }).then((res) => {
        console.log(res)
        if (res.status === 200) {
          if (res.data.statusCode === "200") {
            //显示更新成功
            ElMessage({message: "信息更新成功！", type: "success"});
          }
          else if (res.data.statusCode === "301") {
            ElMessage({message: "修改后的用户昵称与其他用户昵称重复！", type: "warning"});
          }
          else if (res.data.statusCode === "303") {
            ElMessage({message: "不能将用户昵称修改为空！", type: "warning"});
          }
          else {
            ElMessage({message: "发生了未知的错误", type: "error"});
          }
        }
      })
    },
    changeData( e : string, k:string){
      if(k==='用户昵称') {
        if (e.length <= 0) {
          return;
        }
        this.userData.userName = e;
      }
      else if(k==='手机号码')
      {
        this.userData.userPhoneNumber=e
      }
      else if(k==='用户邮箱'){
        this.userData.userEmail=e
      }
    },
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
    emitter.on('urlChange', e => this.userData.imgUrl=e as string )
    loadingData().then((res)=>{
      this.userData=res
      if(this.userData.imgUrl===''){
        this.userData.imgUrl=defaultAvatar
      }
    })
  }
}
</script>
