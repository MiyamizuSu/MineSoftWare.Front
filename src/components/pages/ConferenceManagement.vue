<!-- src/views/MainView.vue -->
<style>

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

<template>

  <!--    <img class="bg" src="../images/bg1.jpg" alt="背景">-->
  <el-container>
    <!--        顶部logo部分-->
    <el-header class="Header" style="padding-left: 0; padding-right: 0;border: 1px solid #eee;height: fit-content">
      <el-row style="height: 60px">
        <el-col :span="20" style="height: 60px">
          <!--一个-col的长度为24SPan-->
          <div class="projectLabelC">
            <label class="projectLabel">测盟汇管理系统-会议管理</label>
          </div>
        </el-col>
        <el-col :span="4" style="height: 60px">
          <div class="userMessageContainer">
            <div class="usernameContainer">
              <label style="min-width: 60px; font-size: 17px;" v-if="currentUser.userType >= 0"> {{ currentUser.userName }}</label>
              <label style="min-width: 60px; font-size: 17px;" v-else> 未登录 </label>
              <div style="margin-left: 15px;margin-top: -9px">
                <el-dropdown>
                <span class="el-dropdown-link">
                  <el-avatar v-bind:src="currentUser.imgUrl" shape="circle" v-if="currentUser.userType >= 0"
                             style="height: 55px; width: 55px; margin-top: 0; ">
                  </el-avatar>
                  <el-avatar :icon="UserFilled" v-else />
                </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item  @click="toUserMessage">
                        <span>个人信息</span>
                      </el-dropdown-item>
                      <el-dropdown-item  @click="logout">
                        <span>退出账号</span>
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
      <el-container >
        <!--                侧边栏视图部分-->
        <el-aside style="width: 210px;height:100%" >
          <div style="height: 100%">
            <el-row style="height: 100%">
              <el-menu class="el-menu-vertical-demo"
                       :default-active="nowIndex"
                       style="height: 100%"
                       @select="handleSelectIndex"
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
          <!-- 搜索框 -->
          <div >
            <label style="font-size: 14px; font-weight: bolder;">会议名称</label>
            <el-input placeholder="请输入会议名称"   type="text" v-model="search_conferenceName"
                      style="width: 160px; margin-left: 15px; margin-right: 60px; font-size: 14px;"></el-input>

            <label style="font-size: 14px; font-weight: bolder;">创建人</label>
            <el-input placeholder="请输入会议创建人"   type="text" v-model="search_creator"
                      style="width: 160px; margin-left: 15px; margin-right: 60px; font-size: 14px;"></el-input>

            <label style="font-size: 14px; font-weight: bolder; margin-right: 15px;">开始时间</label>
            <el-date-picker
                v-model="search_beginTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                value-on-clear=""
                placeholder="选择日期时间"
                :picker-options="pickerOptions">
            </el-date-picker>

            <el-button type="primary"  icon="Search"  @click="search" style="font-size: 13px; margin-left: 20px;">搜索</el-button>
            <el-button type="info"  icon="Refresh"  @click="resetSearch" style="font-size: 13px; margin-left: 20px;">重置</el-button>
          </div>

          <!-- 一排按钮 -->
          <p style="margin-top: 20px; margin-bottom: 10px;">
            <el-button type="primary" plain icon="Plus"  @click="start_addConference" style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">新增</el-button>
            <el-button type="success" plain icon="Edit"  @click="start_updateConference(selectedConference)"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">修改</el-button>
            <el-button type="danger" plain icon="Delete"  @click="deleteSelectedConferences"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">删除</el-button>
            <el-button type="warning" plain icon="Download"  @click=""  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">导出</el-button>
          </p>

          <el-table
              v-bind:data="tableData"
              height="550px"
              style="width: 100%; "
              @selection-change="handleSelectionChange"
              @select="handleSelect"
          >
            <el-table-column type="selection"  label="选择">
            </el-table-column>
            <el-table-column
                prop="conferenceId"
                label="会议编号"
                width="80"
                style="text-align: center;">
            </el-table-column>
            <el-table-column
                prop="conferenceName"
                label="会议名称"
                width="220"
                style="text-align: center;">
            </el-table-column>
            <el-table-column
                prop="creator"
                label="创建人"
                width="220">
            </el-table-column>
            <el-table-column
                prop="state"
                label="会议状态"
                width="130">
            </el-table-column>
            <el-table-column
                prop="content"
                label="会议内容"
                width="280">
            </el-table-column>

            <el-table-column
                prop="beginTime"
                label="开始时间"
                width="180">
            </el-table-column>

            <el-table-column
                label="修改信息" width="90">
              <template #default="scope">
                <!--                  <i class="Edit" style="font-size: 14px; color: #007bff" @click="start_updateConference(scope.row)"> 修改</i>-->
                <label @click="start_updateConference(scope.row)"
                       style="font-size: 15px; color: #007bff"><el-icon> <Edit /> </el-icon> 修改</label>
              </template>
            </el-table-column>
            <el-table-column
                label="删除" width="90">
              <template #default="scope">
                <!--                  <i class="el-icon-delete" style="font-size: 14px; color: red" @click="deleteConference(scope.row)"> 删除</i>-->
                <label @click="deleteSingleConference(scope.row)"
                       style="font-size: 15px; color: red"><el-icon> <Delete /> </el-icon> 删除</label>
              </template>
            </el-table-column>

          </el-table>

          <el-dialog v-model="addConference_dialogFormVisible" title="添加会议" style="width: 80%; height: 700px;"
                     v-bind:before-close="handle_dialogClose">
            <el-form :model="add_conferenceForm" :rules="add_conferenceRules">
              <el-form-item label="会议名称" prop="conferenceName" label-width="120px">
                <el-input type="text" v-model="add_conferenceForm.conferenceName" placeholder="请输入会议名称" autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="会议封面" prop="imgUrl" label-width="120px">
                <el-upload
                    class="avatar-uploader"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false"

                >
                  <img v-if="imageUrl" :src="add_conferenceForm.imgUrl" class="avatar" style="width: 200px;">
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              <p style="color: red; margin-top: 0; margin-left: 120px;">请上传大小不超过5MB 格式为png/jpg/jpeg的文件</p>
              <el-form-item label="会议内容" prop="content" label-width="120px">

                <img src="../resource/rich_text_edit.png" style="width: 1153px; margin: 0; padding: 0;">
                <el-input type="textarea" v-model="add_conferenceForm.content" :autosize="{ minRows: 5, maxRows: 10}"
                          placeholder="请输入会议内容" style="margin-top: -15px; padding: 0; font-size: 15px;"></el-input>
              </el-form-item>
              <el-form-item label="创建人" prop="creator" label-width="120px">
                <el-input v-model="add_conferenceForm.creator" placeholder="请输入创建人" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="beginTime" label-width="120px">
                <el-date-picker
                    v-model="add_conferenceForm.beginTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    value-on-clear=""
                    :picker-options="pickerOptions"
                    style="width: 300px;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime" label-width="120px">
                <el-date-picker
                    v-model="add_conferenceForm.endTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions"
                    style="width: 300px;">
                </el-date-picker>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
              <el-button type="primary" @click="confirm_addConference">确定</el-button>
              <el-button @click="cancel_addConference">取消</el-button>
            </div>
          </el-dialog>

          <el-dialog title="修改会议" v-model="updateConference_dialogFormVisible"  style="width: 80%; height: 700px;"
          >
            <el-form :model="edit_conferenceForm" :rules="add_conferenceRules">
              <el-form-item label="会议名称" prop="conferenceName" label-width="120px">
                <el-input type="text" v-model="edit_conferenceForm.conferenceName" placeholder="请输入会议名称" autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="会议封面" prop="imgUrl" label-width="120px">
                <!--                  <el-upload-->
                <!--                      class="avatar-uploader"-->
                <!--                      action="https://jsonplaceholder.typicode.com/posts/"-->
                <!--                      :show-file-list="false"-->
                <!--                  >-->
                <!--                    <img v-if="imageUrl" :src="selectedConference.imgUrl" class="avatar" style="width: 200px;">-->
                <!--                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                <!--                    <div slot="tip" class="el-upload__tip" style="color: red; margin-top: 0;">请上传大小不超过5MB 格式为png/jpg/jpeg的文件</div>-->
                <!--                  </el-upload>-->

                <el-upload
                    class="avatar-uploader"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false"

                >
                  <img v-if="selectedConference.imgUrl" :src="selectedConference.imgUrl" class="avatar" style="width: 200px;">
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              <p style="color: red; margin-top: 0; margin-left: 120px;">请上传大小不超过5MB 格式为png/jpg/jpeg的文件</p>
              <el-form-item label="会议内容" prop="content" label-width="120px">
                <img src="../resource/rich_text_edit.png" style="width: 1153px; margin: 0; padding: 0;">
                <el-input type="textarea" v-model="edit_conferenceForm.content" :autosize="{ minRows: 5, maxRows: 10}"
                          placeholder="请输入会议内容" style="margin-top: -15px; padding: 0; font-size: 15px;"></el-input>
              </el-form-item>
              <el-form-item label="创建人" prop="creator" label-width="120px">
                <el-input v-model="edit_conferenceForm.creator" placeholder="请输入创建人" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="beginTime" label-width="120px">
                <el-date-picker
                    v-model="edit_conferenceForm.beginTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    align="right"
                    :picker-options="pickerOptions"
                    style="width: 300px;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime" label-width="120px">
                <el-date-picker
                    v-model="edit_conferenceForm.endTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions"
                    style="width: 300px;">
                </el-date-picker>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirm_updateConference">确定</el-button>
              <el-button @click="cancel_updateConference">取消</el-button>
            </div>
          </el-dialog>

          <el-pagination style="margin-left: 550px; margin-top: 50px;"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="1"
                         :page-sizes="[5, 10, 30, 40]"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="64">
          </el-pagination>



        </el-main>
      </el-container>
    </el-main>
    <el-footer style="border-top: 1px solid #eee;height: 30px;background: black;background-image: none;">
      <div class="CopyrightContainer">
        <label>
          Copyright © 2024 测盟汇 Inc. All rights reserved.
        </label>
      </div>
    </el-footer>
  </el-container>


</template>

<script lang="ts">
import axios from "axios";
import {ElMessage, type TabsPaneContext, ElMessageBox} from "element-plus";
import router from "@/router";
import {useRoute} from "vue-router";
import {ref} from "vue";
import {UserFilled} from "@element-plus/icons-vue";
import {loadingData, type USERDATA, type Conference} from "@/utilTs/util";

axios.defaults.withCredentials =true;

export default {
  setup() {
    // const userType = ref("1")
    const nowIndex = ref("5");
    // const tableData = ref([]);
    return {
      UserFilled, nowIndex
    }
  },
  data() {
    return {
      // currentUserId: -1,
      currentUser: <USERDATA>{
        userName: "",
        userRealName: "",
        userPhoneNumber: "",
        userEmail: "",
        imgUrl: "",
        userType: -1,
        belongCompany: "",
        belongDept: "",
        startTime: "",
      },
      default_imgUrl: "https://www.keaitupian.cn/cjpic/frombd/1/253/3323801689/1232602040.jpg",
      search_conferenceName: "",
      search_creator: "",
      search_beginTime: '',
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker: any) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker: any) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker: any) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },

      addConference_dialogFormVisible: false,
      add_conferenceForm: {
        conferenceName: "",
        imgUrl: "",
        content: "",
        creator: "",
        beginTime: "",
        endTime: ""
      },
      updateConference_dialogFormVisible: false,
      edit_conferenceForm: {
        conferenceName: "",
        imgUrl: "",
        content: "",
        creator: "",
        beginTime: "",
        endTime: ""
      },
      tableData: <Conference[]>[],
      multipleSelection: <Conference[]>[],
      conferenceList: <Conference[]>[
        {
          conferenceId: 1,
          conferenceName: "加快工业软件自主创新讨论会",
          creator: "江苏省软件产品检测中心",
          state: "已结束", //会议状态：进行中 / 已结束
          content: "江苏省出台政策措施加快工业软件自主创新",
          beginTime: "2024-06-05 13:00:00",
          endTime: "",
          imgUrl: "https://ts1.cn.mm.bing.net/th/id/R-C.be55050ea711326724b0862f590700c2?rik=l%2bmHV%2f7Nm9gAhg&riu=http%3a%2f%2fpic.52112.com%2f180201%2fBusiness-meeting%2fBqOa49RaEe.jpg&ehk=x90e%2fMmGhIEj1kb3nZhMT9Np8oM%2fNtNrd3Ht32sbjC0%3d&risl=&pid=ImgRaw&r=0",
        },
        {
          conferenceId: 2,
          conferenceName: "聚智创新 质惠未来",
          creator: "北方实验室（沈阳）股份有限公司",
          state: "已结束", //会议状态：进行中 / 已结束
          content: "北方实验室带您走近第一届信息系统工程监理高质量大会",
          beginTime: "2024-05-27 10:00:00",
          endTime: "",
          imgUrl: "https://ts1.cn.mm.bing.net/th/id/R-C.baceed808eeacf0513fe11b613def9a5?rik=xHyj%2bXQqF4O7FA&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20180521%2fe91e1094336941da9143c0dea5381ef4.jpeg&ehk=ovfLQ1hWrygli2m3Ty%2fLI1q7wb%2b7680UEQlqzQW3iwA%3d&risl=&pid=ImgRaw&r=0",
        },
        {
          conferenceId: 3,
          conferenceName: "主题教育专题民主生活会",
          creator: "上海计算机软件技术开发中心",
          state: "进行中", //会议状态：进行中 / 已结束
          content: "上海软件中心召开主题教育专题民主生活会",
          beginTime: "2024-06-19 14:00:00",
          endTime: "",
          imgUrl: "",
        },

      ],
      selectedConference: <Conference>{
        conferenceId: -1,
        conferenceName: "",
        creator: "",
        state: "", //会议状态：进行中 / 已结束
        content: "",
        beginTime: "",
        endTime: "",
        imgUrl: "",
      },
      add_conferenceRules: {
        conferenceName: [
          {required: true, message: "请输入会议名称", trigger: "blur"}
        ],
        imgUrl: [
          {required: true, message: '请上传会议封面', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入会议内容', trigger: 'blur'}
        ],
        creator: [
          {required: true, message: '请输入创建人', trigger: 'blur'}
        ],
        beginTime: [
          {required: true, message: '请选择开始时间', trigger: 'blur'}
        ],
        endTime: [
          {required: true, message: '请选择结束时间', trigger: 'blur'}
        ],
      },

      imageUrl: "", //
    }
  },

  mounted() {
    // const route = useRoute();
    this.loadUser();
    this.tableData = this.conferenceList;
  },

  methods: {
    logout() {
      // router.push("/login");
      //安全退出当前账号
      axios.get("http://localhost:8080/user/logout").then(
          res => {
            if (res.status === 200) {
              router.push("/basicView")
            }
          }
      );
    },
    toUserMessage() {
      router.push({path: "/userMessageView"});
    },
    handleSelectIndex(index: string) {
      this.nowIndex = index;
      if (index == "0") {
        router.push("/mainView");
      } else if (index === "1") {

      } else if (index === "2") {

      } else if (index === "3") {

      } else if (index === "4") {

      }
    },
    //上传图片这部分得看element-plus文档
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    // beforeAvatarUpload(file: File) {
    //   const isJPG = file.type === 'image/jpeg';
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //
    //   if (!isJPG) {
    //     ElMessage({message: '上传头像图片只能是 JPG 格式!', type: "warning"});
    //   }
    //   if (!isLt2M) {
    //     ElMessage({message: '上传头像图片大小不能超过 2MB!', type: "warning"});
    //   }
    //   return isJPG && isLt2M;
    // },
    handleSelectionChange(val: Conference[]) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    handleSelect(selection: Conference[], row: Conference) {
      this.selectedConference = row;
    },
    search() {
      if (this.search_beginTime !== "") {
        console.log(this.search_beginTime);
        this.tableData = this.conferenceList.filter((conference) => conference.conferenceName.includes(this.search_conferenceName)
            && conference.creator.includes(this.search_creator) && conference.beginTime == this.search_beginTime);
      } else {
        this.tableData = this.conferenceList.filter((conference) => conference.conferenceName.includes(this.search_conferenceName)
            && conference.creator.includes(this.search_creator));
      }
    },
    resetSearch() {
      this.search_conferenceName = "";
      this.search_creator = "";
      this.search_beginTime = "";
      this.tableData = this.conferenceList;
    },
    start_addConference() {
      this.addConference_dialogFormVisible = true;
      // ElMessage({message: "新增按钮被点击了！", type: "info"});
    },
    cancel_addConference() {
      this.addConference_dialogFormVisible = false;
    },
    confirm_addConference() {
      ElMessage({message: "添加成功！", type: "success"});
      this.addConference_dialogFormVisible = false;
    },
    start_updateConference(conference: Conference) {
      this.selectedConference = conference;
      // ElMessage({message: "修改按钮被点击了！", type: "info"});
      if (conference.conferenceId < 0) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      this.edit_conferenceForm.conferenceName = conference.conferenceName;
      this.edit_conferenceForm.imgUrl = conference.imgUrl;
      this.edit_conferenceForm.content = conference.content;
      this.edit_conferenceForm.creator = conference.creator;
      this.edit_conferenceForm.beginTime = conference.beginTime;
      this.edit_conferenceForm.endTime = conference.endTime;
      this.imageUrl = conference.imgUrl;
      this.updateConference_dialogFormVisible = true;
    },
    cancel_updateConference() {
      this.updateConference_dialogFormVisible = false;
    },
    confirm_updateConference() {
      //axios向后端发送更新请求
      ElMessage({message: "修改成功！", type: "success"});
      this.updateConference_dialogFormVisible = false;
    },
    deleteSingleConference(conference: Conference) {
      ElMessageBox.confirm(
          `确认要删除会议管理编号为 ${conference.conferenceId} 的会议数据项吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => { //确认

        ElMessage({message: "删除成功", type: "success"});
      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },
    deleteSelectedConferences() {
      if (this.multipleSelection.length == 0) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      console.log("将要被删除的会议list: ");
      console.log(this.multipleSelection);
      ElMessageBox.confirm(
          `确认要删除所有选中的会议数据项吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: "warning",
          }
      ).then(() => { //确认
        for (const conference of this.multipleSelection) {
          // axios.post("http://localhost:8080/conference/deleteById", {
          //   conferenceId: conference.conferenceId
          // }).then(res => {
          //   if (res.data.isOk) {
          //     //
          //   }
          // });
          console.log(conference);
        }
        ElMessage({message: "删除成功", type: "success"});
        //更新会议列表数据
      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },

    handleSizeChange(val: number) {
      ElMessage({message: `每页 ${val}条`, type: "info"});
    },
    handleCurrentChange(val: number) {
      ElMessage({message: `当前页: ${val}`, type: "info"});
    },
    //
    loadUser() {
      axios.get("http://localhost:8080/user/loading").then(
          res => {
            if (res.data.userData != null) {
              this.currentUser = res.data.userData;
              // ElMessage({message: "通过session登录成功！", type: "success"});
              console.log("从后端加载的当前session中的user：");
              console.log(this.currentUser);
              if (this.currentUser.imgUrl==null || this.currentUser.imgUrl=="") {
                this.currentUser.imgUrl = this.default_imgUrl;
              }
            } else {
              ElMessage({message: res.data.msg, type: "warning"});
            }
          }
      );


    },
    loadConferences() { //重新从数据库中加载会议列表数据

    },
    saveUser() {
      axios.post("http://localhost:8080/user/update", this.currentUser).then(
          res => {
            console.log(res);
            if (res.data.isOk) {
              ElMessage({message: "信息更新成功！", type: "success"});
            }
          }
      );
    },
    handle_dialogClose() {
      ElMessageBox.confirm(
          '确认关闭吗？',
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => { //确认
        ElMessage({message: "为防止意外关闭，请点击下方取消按钮关闭对话框", type: "info"});
      }).catch(() => { //取消
        ElMessage({message: "已取消关闭~", type: "info"});
      });

    },



  }

}
</script>
