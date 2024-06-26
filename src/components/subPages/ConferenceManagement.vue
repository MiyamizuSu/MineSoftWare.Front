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
  <!-- 外围边框部分不用再写,只要写el-main里的部分 -->
  <!--    <img class="bg" src="../images/bg1.jpg" alt="背景">-->
  <el-container>
        <el-main>
          <!-- 搜索框 -->
          <div style="margin-top: 0;">
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

            <el-button type="primary" plain icon="Search"  @click="search" style="font-size: 14px; margin-left: 20px;">搜索</el-button>
            <el-button type="info" plain icon="Refresh"  @click="resetSearch" style="font-size: 14px; margin-left: 20px;">重置</el-button>
          </div>

          <!-- 一排按钮 -->
          <p style="margin-top: 20px; margin-bottom: 10px;">
            <el-button type="primary" plain icon="Plus"  @click="start_addConference" style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">新增</el-button>
            <el-button type="success" plain icon="Edit"  @click="start_updateConference(selectedConference)"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">修改</el-button>
            <el-button type="danger" plain icon="Delete"  @click="deleteSelectedConferences"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">删除</el-button>
            <el-button type="warning" plain icon="Download"  @click="onBatchExport"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">导出</el-button>
          </p>

          <el-table
              v-bind:data="showData"
              height="590px"
              style="width: 100%; "
              @selection-change="handleSelectionChange"
              @select="handleSelect"
              id="conference_table"
          >
            <el-table-column type="selection"  label="选择">
            </el-table-column>
<!--            <el-table-column-->
<!--                prop="conferenceId"-->
<!--                label="会议编号"-->
<!--                width="80"-->
<!--                style="text-align: center;">-->
<!--            </el-table-column>-->
            <el-table-column
                prop="conferenceName"
                label="会议名称"
                width="180"
                style="text-align: center;">
            </el-table-column>
            <el-table-column
                prop="creator"
                label="创建人"
                width="160">
            </el-table-column>
            <el-table-column
                prop="state"
                label="会议状态"
                width="90">
            </el-table-column>
            <el-table-column
                prop="content"
                label="会议内容"
                width="260">
            </el-table-column>

            <el-table-column
                prop="beginTime"
                label="开始时间"
                width="140">
            </el-table-column>
            <el-table-column
                prop="endTime"
                label="结束时间"
                width="140">
            </el-table-column>

            <el-table-column
                label="会议封面">
                <template #default="scope">
                  <img :src="scope.row.imgUrl" style="height: 80px; max-width: 130px; margin-right: 0;" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <label @click="start_updateConference(scope.row)"
                       style="font-size: 15px; color: #007bff; margin-left: -10px; margin-right: 30px;" ><el-icon> <Edit /> </el-icon> 修改</label>
                <label @click="deleteSingleConference(scope.row)"
                       style="font-size: 15px; color: red"><el-icon> <Delete /> </el-icon> 删除</label>
              </template>
            </el-table-column>


          </el-table>

          <el-dialog v-model="addConference_dialogFormVisible" title="添加会议" style="width: 80%; height: 750px; overflow-y: auto;"
                     v-bind:before-close="handle_dialogClose" draggable>
            <el-form :model="add_conferenceForm" :rules="add_conferenceRules">
              <el-form-item label="会议名称" prop="conferenceName" label-width="120px">
                <el-input type="text" v-model="add_conferenceForm.conferenceName" placeholder="请输入会议名称" autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="会议封面" prop="imgUrl" label-width="120px">
                <el-upload
                    class="avatar-uploader"
                    :show-file-list="true"
                    :http-request="httpRequest"
                    :crossorigin="'use-credentials'"
                >
                  <img v-if="uploadUrl" :src="uploadUrl" class="avatar" style="width: 220px; max-height: 250px;">
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
                    value-format="YYYY-MM-DD HH:mm:ss"
                    value-on-clear=""
                    :picker-options="pickerOptions"
                    style="width: 300px;">
                </el-date-picker>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
              <el-button type="primary" @click="confirm_addConference" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
              <el-button @click="cancel_addConference">取消</el-button>
            </div>
          </el-dialog>

          <el-dialog title="修改会议" v-model="updateConference_dialogFormVisible"  style="width: 80%; height: 750px; overflow-y: auto;"
                     draggable :before-close="handle_dialogClose">
            <el-form :model="edit_conferenceForm" :rules="add_conferenceRules">
              <el-form-item label="会议名称" prop="conferenceName" label-width="120px">
                <el-input type="text" v-model="edit_conferenceForm.conferenceName" placeholder="请输入会议名称" autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="会议封面" prop="imgUrl" label-width="120px">

                <el-upload
                    class="avatar-uploader"
                    :show-file-list="true"
                    :http-request="httpRequest"
                    :crossorigin="'use-credentials'"
                >
                  <img v-if="uploadUrl" :src="uploadUrl" class="avatar" style="width: 220px; max-height: 250px;">
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
                    value-format="YYYY-MM-DD HH:mm:ss"
                    value-on-clear=""
                    :picker-options="pickerOptions"
                    style="width: 300px;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime" label-width="120px">
                <el-date-picker
                    v-model="edit_conferenceForm.endTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    value-on-clear=""
                    :picker-options="pickerOptions"
                    style="width: 300px;">
                </el-date-picker>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
              <el-button type="primary" @click="confirm_updateConference" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
              <el-button @click="cancel_updateConference">取消</el-button>
            </div>
          </el-dialog>

          <el-pagination style="margin-left: 550px; margin-top: 50px;"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 15, 20]"
                     :default-page-size="pageSize"
                     @update:page-size="handleSizeChange"
                     @update:current-page="handleCurrentChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="this.tableData.length"
                      background
                      pager-count="6"
                    >
          </el-pagination>


        </el-main>
  </el-container>
</template>


<script lang="ts">
import axios from "axios";
import {ElMessage, type TabsPaneContext, ElMessageBox, type UploadRequestOptions} from "element-plus";
import router from "@/router";
import {useRoute} from "vue-router";
import {ref} from "vue";
import {UserFilled} from "@element-plus/icons-vue";
import {loadingData, type USERDATA, type Conference, uploadFile} from "@/utilTs/util";
import mitt from "mitt";
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import table2excel from 'js-table2excel';

axios.defaults.withCredentials =true;
const emitter = mitt()

export default {
  setup() {
    // const userType = ref("1")
    const nowIndex = ref("5");
    const httpRequest =(options: UploadRequestOptions ) : void=>{
      const fileTo=options.file
      uploadFile(fileTo).then(res=>{
        console.log(res.data.data.links.url)
        emitter.emit('urlChange',res.data.data.links.url); //发出改变信号，即向图床上传图片获得的url
      })
    };

    const pickerOptions = {
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
    };

    return {
      UserFilled, nowIndex, httpRequest,
      pickerOptions,
    }
  },
  data() {
    return {
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
      uploadUrl: "", //当前向图床上传图片所获得的url

      conferenceList: <Conference[]>[],
      tableData: <Conference[]>[],
      showData: <Conference[]>[],
      //实现分页所需数据
      currentPage: 1,
      pageSize: 5,

      multipleSelection: <Conference[]>[],
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
      addConference_dialogFormVisible: false,
      add_conferenceForm: <Conference>{
        conferenceId: -1,
        conferenceName: "",
        creator: "",
        state: "", //会议状态：进行中 / 已结束
        content: "",
        beginTime: "",
        endTime: "",
        imgUrl: "",
      },
      updateConference_dialogFormVisible: false,
      edit_conferenceForm: <Conference>{
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

    }
  },

  mounted() {
    // const route = useRoute();
    this.loadUser();
    this.loadConferences();
    //规定针对事件信号的响应机制(handler)，
    emitter.on('urlChange', e => this.uploadUrl=e as string )
  },

  methods: {
    handleSizeChange(val: number) {
      this.pageSize = val;
      this.load_showData();
      // ElMessage({message: `pageSize更改为 ${this.pageSize}`, type: "info"});
    },
    handleCurrentChange(val: number) {
      this.currentPage = val;
      this.load_showData();
      ElMessage({message: `当前页: ${this.currentPage}`, type: "info"});
    },
    load_showData() {
      let res = [];
      for (let i=(this.currentPage - 1) * this.pageSize; i<this.tableData.length && i<this.currentPage * this.pageSize; i++) {
        res.push(this.tableData[i]);
      }
      this.showData = res;
      // this.showData = this.tableData.filter((item, index) => index >= (this.currentPage - 1) * this.pageSize
      //     && index < this.currentPage * this.pageSize);
      console.log("当前的showData：");
      console.log(this.showData);
    },
    //将表格导出为excel文件的方法一
    exportExcel() {
      const wb = XLSX.utils.table_to_book(document.getElementById("conference_table"));
      const wb_out = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(new Blob([wb_out], {
          type: "application/object-stream"
        }), "会议列表.xlsx");
      } catch (e) {
        console.log(e);
        console.log(wb_out);
      }
      return wb_out;
    },
    //将表格导出为excel文件的方法二
    onBatchExport() {
      const column = [
        {
          title: "会议名称",
          key: "conferenceName",
          type: "text",
          height: 100,
        },
        {
          title: "创建人",
          key: "creator",
          type: "text",
          height: 100,
        },
        {
          title: "会议状态",
          key: "state",
          type: "text",
          height: 100,
        },
        {
          title: "会议内容",
          key: "content",
          type: "text",
          height: 100,
        },
        {
          title: "开始时间",
          key: "beginTime",
          type: "text",
          height: 100,
        },
        {
          title: "结束时间",
          key: "endTime",
          type: "text",
          height: 100,
        },
        // {
        //   title: "会议封面",
        //   key: "imgUrl",
        //   type: "image",
        //   width: 100,
        //   height: 100,
        // }
      ];
      const exportData = JSON.parse(JSON.stringify(this.tableData));
      table2excel(column, exportData, "会议列表");
    },
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
      this.load_showData();
    },
    resetSearch() {
      this.search_conferenceName = "";
      this.search_creator = "";
      this.search_beginTime = "";
      this.tableData = this.conferenceList;
      this.load_showData();
    },
    start_addConference() {
      this.addConference_dialogFormVisible = true;
      // ElMessage({message: "新增按钮被点击了！", type: "info"});
    },
    cancel_addConference() {
      this.addConference_dialogFormVisible = false;
    },
    confirm_addConference() {
      this.add_conferenceForm.imgUrl = this.uploadUrl;
      if (this.add_conferenceForm.conferenceName=="" || this.add_conferenceForm.creator == "" || this.add_conferenceForm.content==""
          || this.add_conferenceForm.beginTime == "" || this.add_conferenceForm.endTime == "") {
        ElMessage({message: "不能将除会议封面以外的信息设置为空！", type: "warning"});
        return;
      }
      let date1 = new Date(this.add_conferenceForm.beginTime);
      let date2 = new Date(this.add_conferenceForm.endTime);
      if (date2.getTime() < date1.getTime()) {
        ElMessage({message: "结束时间不能早于开始时间！", type: "error"});
        return;
      }
      let dateNow = new Date();
      if (date2.getTime() > dateNow.getTime()) {
        this.add_conferenceForm.state = "进行中";
      } else {
        this.add_conferenceForm.state = "已结束";
      }
      axios.post("http://localhost:8080/conference/add", this.add_conferenceForm).then(res => {
        if (res.data.statusCode == "200") {
          ElMessage({message: "添加成功！", type: "success"});
          this.loadConferences();
          this.addConference_dialogFormVisible = false;
        }
        else if (res.data.statusCode == "501") {
          ElMessage({message: "该会议名称已存在！会议添加失败~", type: "warning"});
        } else {
          ElMessage({message: "发生了未知的错误", type: "error"});
        }
      });

    },
    start_updateConference(conference: Conference) {
      this.selectedConference = conference;
      this.uploadUrl = conference.imgUrl;
      // ElMessage({message: "修改按钮被点击了！", type: "info"});
      if (conference.conferenceId < 0) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      this.edit_conferenceForm.conferenceId = conference.conferenceId;
      this.edit_conferenceForm.conferenceName = conference.conferenceName;
      this.edit_conferenceForm.imgUrl = conference.imgUrl;
      this.edit_conferenceForm.content = conference.content;
      this.edit_conferenceForm.creator = conference.creator;
      this.edit_conferenceForm.beginTime = conference.beginTime;
      this.edit_conferenceForm.endTime = conference.endTime;
      this.edit_conferenceForm.state = conference.state;
      this.updateConference_dialogFormVisible = true;
    },
    cancel_updateConference() {
      this.updateConference_dialogFormVisible = false;
    },
    confirm_updateConference() {
      //axios向后端发送更新请求
      this.edit_conferenceForm.imgUrl = this.uploadUrl;
      if (this.edit_conferenceForm.conferenceName=="" || this.edit_conferenceForm.creator == "" || this.edit_conferenceForm.content==""
      || this.edit_conferenceForm.beginTime == "" || this.edit_conferenceForm.endTime == "") {
        ElMessage({message: "不能将除会议封面以外的信息设置为空！", type: "warning"});
        return;
      }
      let date1 = new Date(this.edit_conferenceForm.beginTime);
      let date2 = new Date(this.edit_conferenceForm.endTime);
      if (date2.getTime() < date1.getTime()) {
        ElMessage({message: "结束时间不能早于开始时间！", type: "error"});
        return;
      }
      let dateNow = new Date();
      if (date2.getTime() > dateNow.getTime()) {
        this.edit_conferenceForm.state = "进行中";
      } else {
        this.edit_conferenceForm.state = "已结束";
      }
      axios.post("http://localhost:8080/conference/getByName", {
        conferenceName: this.edit_conferenceForm.conferenceName
      }).then(res1 => {
        if (res1.data.conference != null && this.edit_conferenceForm.conferenceName !== this.selectedConference.conferenceName) {
          console.log(res1.data);
          ElMessage({message: "您输入的会议名已存在，修改会议失败~", type: "warning"});
          return;
        }
        axios.post("http://localhost:8080/conference/update", this.edit_conferenceForm).then(
          res2 => {
            if (res2.data.isOk) {
              ElMessage({message: "修改成功！", type: "success"});
              this.loadConferences();
              this.updateConference_dialogFormVisible = false;
            }
        })

      });
    },
    deleteSingleConference(conference: Conference) {
      ElMessageBox.confirm(
          `确认要删除会议名称为[ ${conference.conferenceName} ]的会议数据项吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => { //确认
        axios.post("http://localhost:8080/conference/deleteById", {
          conferenceId: conference.conferenceId
        }).then(res => {
          if (res.data.isOk) {
            this.loadConferences();
            ElMessage({message: "删除成功！", type: "success"});
          }
        });

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
        let n = this.multipleSelection.length;
        for (const conference of this.multipleSelection) {
          axios.post("http://localhost:8080/conference/deleteById", {
            conferenceId: conference.conferenceId
          }).then(res => {
            if (res.data.isOk) {
              console.log(`会议名称为${conference.conferenceName}的会议已被删除.`);
              n -= 1;
              //全删除完成后更新会议列表数据，注意下面语句要放到正确的位置
              if (n == 0) {
                this.loadConferences();
                ElMessage({message: "删除成功", type: "success"});
              }

            }
          });
        }
      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
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
            }
            else {
              ElMessage({message: res.data.msg, type: "warning"});
            }
          }
      );

    },
    loadConferences() { //重新从数据库中加载会议列表数据
      axios.get("http://localhost:8080/conference/listAll").then(
          res => {
            if (res.data.conferenceList != null) {
              this.conferenceList = res.data.conferenceList;
              console.log("从后端加载的conferenceList: ");
              console.log(this.conferenceList);
              this.tableData = this.conferenceList;
              this.load_showData(); //别忘了
            }
          }
      )
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
