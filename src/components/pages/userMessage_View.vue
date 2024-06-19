<template>
  <div>
    <el-container style="height:100%">
      <el-header>
        <el-page-header></el-page-header>
      </el-header>
      <el-main style="height: 865px">
        <div style="display: inline-flex">
          <div style="margin-right: -10px;z-index: 100;margin-left: 25%;margin-top:5%">
            <el-card class="box-card" style="height: 640px;width: 640px">
              <img src="../resource/userAvater.png" style="object-fit: cover;width: 100%;height: 100%"/>
              <el-input id="fileInput" style="display: none"  type="file" ></el-input>
              <img src="../resource/编辑.png " style="width: 50px;height: 50px;margin-left: 45%">
            </el-card>
          </div>
          <div style="z-index: 0;margin-top: 5%">
            <el-card class="box-card" style="height: 620px;margin-top: 10px;width: 620px; " body-style="padding-top: 0">
              <template #header>
                <div class="card-header">
                  <span>个人信息</span>
                </div>
              </template>
              <div>
                <message-item type="用户昵称" data="admin" ></message-item>
                <message-item type="手机号码" data="15888888888" ></message-item>
                <message-item type="用户邮箱" data="8888@qqq" ></message-item>
                <message-item type="所属部门" data="admin" ></message-item>
                <message-item type="所属角色" data="admin" ></message-item>
                <message-item type="创建日期" data="admin" ></message-item>
              </div>

              <template #footer>
                Footer content
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
import messageItem from "@/components/item/messageItem.vue"
import MessageItem from "@/components/item/messageItem.vue";
export default {
  components: {MessageItem},
  // 组合式API部分，存放非数据变量
  setup() {
    return {

    }

  },
  // 选项式API部分，存放实体数据变量
  data() {
    return {
    }
  },
  methods: {

  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {

  }
}
</script>
