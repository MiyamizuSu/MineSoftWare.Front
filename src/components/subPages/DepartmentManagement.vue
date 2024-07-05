<template>
  <el-container>
    <el-main>
      <div style="margin-top: 0;">
        <label style="font-size: 14px; font-weight: bolder;">部门名称</label>
        <el-input placeholder="请输入部门名称"   type="text" v-model="search_departmentName"
                  style="width: 160px; margin-left: 15px; margin-right: 60px; font-size: 14px;"></el-input>

        <label style="font-size: 14px; font-weight: bolder;">部门状态</label>
        <el-select v-model="search_departmentState" placeholder="请选择部门状态" style="width: 160px; margin-left: 15px; margin-right: 60px; font-size: 14px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>

        <el-button type="primary" plain icon="Search"  @click="search" style="font-size: 14px; margin-left: 20px;">查询</el-button>
        <el-button type="info" plain icon="Refresh"  @click="resetSearch" style="font-size: 14px; margin-left: 20px;">重置</el-button>
      </div>

      <!-- 一排按钮 -->
      <p style="margin-top: 20px; margin-bottom: 10px;">
        <el-button type="primary" plain icon="Plus"  @click="start_addDepartment" style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">新增</el-button>
        <el-button type="success" plain icon="Edit"  @click="start_updateDepartment(selectedDepartment)"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">修改</el-button>
        <el-button type="danger" plain icon="Delete"  @click="deleteSelectedDepartments"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">删除</el-button>
        <el-button type="warning" plain icon="Download"  @click="onBatchExport"  style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">导出</el-button>
      </p>

      <el-table
          v-bind:data="showData"
          height="590px"
          style="width: 100%; "
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          id="department_table">

        <el-table-column type="selection"  label="选择">
        </el-table-column>

        <el-table-column
            prop="departmentName"
            label="部门名称"
            width="180"
            style="text-align: center;">
        </el-table-column>
        <el-table-column
            prop="departmentPerson"
            label="负责人"
            width="160">
        </el-table-column>
        <el-table-column
            prop="personTel"
            label="联系电话"
            width="260">
        </el-table-column>
        <el-table-column
            prop="departmentState"
            label="部门状态"
            width="90">
        </el-table-column>
        <el-table-column
            prop="upper"
            label="所属上级"
            width="140">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="140">
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <label @click="start_updateDepartment(scope.row)"
                   style="font-size: 15px; color: #007bff; margin-left: -10px; margin-right: 30px;" ><el-icon> <Edit /> </el-icon> 修改</label>
            <label @click="deleteSingleDepartment(scope.row)"
                   style="font-size: 15px; color: red"><el-icon> <Delete /> </el-icon> 删除</label>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="addDepartment_dialogFormVisible" title="添加部门" style="width: 80%; height: 750px; overflow-y: auto;"
                 v-bind:before-close="handle_dialogClose" draggable overflow>
        <el-form :model="add_departmentForm" :rules="add_departmentRules">

          <el-form-item label="上级部门" prop="upper" label-width="120px">
            <el-input type="text" v-model="add_departmentForm.upper" placeholder="请输入上级部门" autocomplete="off" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item label="部门名称" prop="departmentName" label-width="120px">
            <el-input type="text" v-model="add_departmentForm.departmentName" placeholder="请输入部门名称" autocomplete="off" style="width: 300px;" ></el-input>
          </el-form-item>

          <el-form-item label="负责人" prop="departmentPerson" label-width="120px">
            <el-input v-model="add_departmentForm.departmentPerson" placeholder="请输入负责人" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="personTel" label-width="120px">
            <el-input v-model="add_departmentForm.personTel" placeholder="请输入联系电话" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item label="部门状态" prop="departmentState" label-width="120px">
            <el-select v-model="add_departmentForm.departmentState" placeholder="请选择部门状态" style="width: 240px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <el-button type="primary" @click="confirm_addDepartment" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
          <el-button @click="cancel_addDepartment">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改部门" v-model="updateDepartment_dialogFormVisible"  style="width: 80%; height: 750px; overflow-y: auto;"
                 draggable  overflow :before-close="handle_dialogClose">
        <el-form :model="edit_departmentForm" :rules="add_departmentRules">

          <el-form-item label="上级部门" prop="upper" label-width="120px">
            <el-input v-model="edit_departmentForm.upper" placeholder="请输入上级部门" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item label="部门名称" prop="departmentName" label-width="120px">
            <el-input type="text" v-model="edit_departmentForm.departmentName" placeholder="请输入部门名称" autocomplete="off" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item label="负责人" prop="departmentPerson" label-width="120px">
            <el-input v-model="edit_departmentForm.departmentPerson" placeholder="请输入负责人" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="personTel" label-width="120px">
            <el-input v-model="edit_departmentForm.personTel" placeholder="请输入联系电话" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item label="部门状态" prop="departmentState" label-width="120px">
            <el-select v-model="edit_departmentForm.departmentState" placeholder="请选择部门状态" style="width: 240px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
          <el-button type="primary" @click="confirm_updateDepartment" style="margin-left: 30%; margin-right: 20px;">确定</el-button>
          <el-button @click="cancel_updateDepartment">取消</el-button>
        </div>
      </el-dialog>

      <el-pagination style="margin-left: 550px; margin-top: 50px;"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 15, 20]"
                     :default-page-size="pageSize"
                     @update:page-size="handleSizeChange"
                     @update:current-page="handleCurrentChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.length"
                     background
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
import {UserFilled} from "@element-plus/icons-vue";
import {loadingData, type USERDATA, type Department,type Company, uploadFile} from "@/utilTs/util";
import mitt from "mitt";
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import table2excel from 'js-table2excel';
import { onBeforeUnmount, ref, shallowRef } from 'vue'
// import { Editor, Toolbar,  } from '@wangeditor/editor-for-vue'

axios.defaults.withCredentials =true;
const emitter = mitt()

export default {
  setup() {
    const nowIndex = ref("5");
    const httpRequest =(options: UploadRequestOptions ) : void=>{
      const fileTo=options.file
      uploadFile(fileTo).then(res=>{
        console.log(res.data.data.links.url)
        emitter.emit('urlChange',res.data.data.links.url); //hold
      })
    };

    const options = [
      {
        value: '正常',
        label: '正常',
      },
      {
        value: '停用',
        label: '停用',
      },
    ]

    return {
      UserFilled, nowIndex, httpRequest,
        mode: 'simple', options,
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

        search_departmentName: "",
        search_departmentState: "",
        uploadUrl: "",

        departmentList: <Department[]>[],
        tableData: <Department[]>[],
        showData: <Department[]>[],

        currentPage: 1,
        pageSize: 5,

        multipleSelection: <Department[]>[],
        selectedDepartment: <Department>{
          departmentId: -1,
          departmentName: "",
          departmentPerson: "",
          personTel: "",
          departmentState:"",
          upper: "",
          createTime: "",
        },

        findCompany: <Company>{
          companyName: "",
        },

        addDepartment_dialogFormVisible: false,
        add_departmentForm: <Department>{
          departmentId: -1,
          departmentName: "",
          departmentPerson: "",
          personTel: "",
          departmentState: "",
          upper: "",
          createTime: "",
        },
        add_content_valueHTML: "",
        updateDepartment_dialogFormVisible: false,
        edit_departmentForm: <Department>{
          departmentId: -1,
          departmentName: "",
          departmentPerson: "",
          personTel: "",
          departmentState: "",
          upper: "",
          createTime: "",
        },
        edit_content_valueHTML: "",
        add_departmentRules: {
          upper: [
            {required: true, message: '请输入上级部门', trigger: 'blur'}
          ],
          departmentName: [
            {required: true, message: "请输入部门名称", trigger: "blur"}
          ],
          departmentPerson: [
            {required: true, message: '请输入负责人', trigger: 'blur'}
          ],
          personTel: [
            {required: true, message: '请输入联系电话', trigger: 'blur'}
          ],
          departmentState: [
            {required: true, message: '请输入部门状态', trigger: 'blur'}
          ],
        },

      }
  },
  mounted() {
    this.loadData();
    emitter.on('urlChange', e => this.uploadUrl=e as string )
  },

  methods: {
    handleSizeChange(val: number) {
      this.pageSize = val;
      this.load_showData();

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
      console.log("当前的showData：");
      console.log(this.showData);
    },

    onBatchExport() {
      const column = [
        {
          title: "部门名称",
          key: "departmentName",
          type: "text",
          height: 100,
        },
        {
          title: "负责人",
          key: "departmentPerson",
          type: "text",
          height: 100,
        },
        {
          title: "联系电话",
          key: "personTel",
          type: "text",
          height: 100,
        },
        {
          title: "部门状态",
          key: "departmentState",
          type: "text",
          height: 100,
        },
        {
          title: "所属上级",
          key: "upper",
          type: "text",
          height: 100,
        },
        {
          title: "创建时间",
          key: "createTime",
          type: "text",
          height: 100,
        },

      ];
      const exportData = JSON.parse(JSON.stringify(this.tableData));
      table2excel(column, exportData, "部门列表");
    },
    handleSelectionChange(val: Department[]) {
      this.multipleSelection = val;
    },
    handleSelect(selection: Department[], row: Department) {
      this.selectedDepartment = row;
    },
    search() {
      if (this.search_departmentState !== "") {
        console.log(this.search_departmentState);
        this.tableData = this.departmentList.filter((department) => department.departmentName.includes(this.search_departmentName)
             && department.departmentState.includes(this.search_departmentState) );
      } else {
        this.tableData = this.departmentList.filter((department) => department.departmentName.includes(this.search_departmentName));
      }
      this.load_showData();
    },
    resetSearch() {
      this.search_departmentName = "";
      this.search_departmentState = "";
      this.tableData = this.departmentList;
      this.load_showData();
    },

    start_addDepartment() {
      this.add_departmentForm.upper = this.currentUser.belongCompany;
      this.addDepartment_dialogFormVisible = true;
    },
    cancel_addDepartment() {
      this.addDepartment_dialogFormVisible = false;
    },
    confirm_addDepartment() {
      if (this.add_departmentForm.upper=="" ||this.add_departmentForm.departmentName=="" ||this.add_departmentForm.departmentPerson=="" ||
          this.add_departmentForm.personTel=="" ){
        ElMessage({message: "不能将信息设置为空！", type: "warning"});
        return;
      }
      axios.post("http://localhost:8080/company/getByName",{companyName : this.add_departmentForm.upper}).then(res1 => {
        if (res1.data.company == null) {
          ElMessage({message: "该企业不存在！上级部门无效", type: "warning"});
          return;
        }
        axios.post("http://localhost:8080/department/add", this.add_departmentForm).then(res2 => {
          if(this.currentUser.userType!=2&&this.currentUser.belongCompany!=this.add_departmentForm.upper){
            ElMessage({message: "您只能为您所属企业新增部门！", type: "warning"});
          }
          else if (res2.data.statusCode == "200") {
            ElMessage({message: "添加成功！", type: "success"});
            this.loadDepartments();
            this.add_departmentForm.departmentName="";
            this.add_departmentForm.departmentPerson="";
            this.add_departmentForm.upper="";
            this.add_departmentForm.personTel="";
            this.add_departmentForm.createTime="";
            this.add_departmentForm.departmentState="";
            this.addDepartment_dialogFormVisible = false;
          }
          else if (res2.data.statusCode == "601") {
            ElMessage({message: "该部门名称已存在！部门添加失败~", type: "warning"});
          }
          else {
            ElMessage({message: "发生了未知的错误", type: "error"});
          }
        });
      });


    },

    start_updateDepartment(department: Department) {
      this.selectedDepartment = department;
      if (department.departmentId < 0) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      this.edit_departmentForm.departmentId = department.departmentId;
      this.edit_departmentForm.departmentName = department.departmentName;
      this.edit_departmentForm.departmentPerson = department.departmentPerson;
      this.edit_departmentForm.personTel = department.personTel;
      this.edit_departmentForm.departmentState = department.departmentState;
      this.edit_departmentForm.createTime = department.createTime;
      this.edit_departmentForm.upper = department.upper;
      this.updateDepartment_dialogFormVisible = true;
    },
    cancel_updateDepartment() {
      this.updateDepartment_dialogFormVisible = false;
    },
    confirm_updateDepartment() {
      //axios向后端发送更新请求
      if (this.edit_departmentForm.upper=="" ||this.edit_departmentForm.departmentName=="" ||this.edit_departmentForm.departmentPerson=="" ||
          this.edit_departmentForm.personTel=="" || this.edit_departmentForm.departmentState=="") {
        ElMessage({message: "不能将信息设置为空！", type: "warning"});
        return;
      }
      axios.post("http://localhost:8080/company/getByName",{companyName : this.edit_departmentForm.upper}).then(res1 => {
        if (res1.data.company == null) {
          ElMessage({message: "该企业不存在！上级部门无效", type: "warning"});
          return;
        }
        axios.post("http://localhost:8080/department/getByNameAndUpper", {
          departmentName: this.edit_departmentForm.departmentName,
          upper: this.edit_departmentForm.upper,
        }).then(res2 => {
            if (res2.data.department != null && this.edit_departmentForm.departmentName !== this.selectedDepartment.departmentName) {
              console.log(res2.data);
              ElMessage({message: "您输入的部门名已存在，修改部门失败~", type: "warning"});
              return;
            }
            axios.post("http://localhost:8080/department/update", this.edit_departmentForm)
                .then(res3 => {
                  if(this.currentUser.userType!=2&&this.currentUser.belongCompany!=this.edit_departmentForm.upper){
                    ElMessage({message: "您只能为您所属企业修改部门！", type: "warning"});
                  }
                  else if (res3.data.isOk) {
                    ElMessage({message: "修改成功！", type: "success"});
                    this.loadDepartments();
                    this.updateDepartment_dialogFormVisible = false;
                  }
                });

          });
      });


      // ElMessage({message: "11111", type: "success"});
    },

    deleteSingleDepartment(department: Department) {
      ElMessageBox.confirm(
          `确认要删除部门名称为[ ${department.departmentName} ]的部门数据项吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => { //确认
        axios.post("http://localhost:8080/department/deleteById", {
          departmentId: department.departmentId
        }).then(res => {
          if (res.data.isOk) {
            this.loadDepartments();
            ElMessage({message: "删除成功！", type: "success"});
          }
        });

      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },
    deleteSelectedDepartments() {
      if (this.multipleSelection.length == 0) {
        ElMessage({message: "请先选择数据项！", type: "info"});
        return;
      }
      console.log("将要被删除的部门list: ");
      console.log(this.multipleSelection);
      ElMessageBox.confirm(
          `确认要删除所有选中的部门数据项吗？`,
          '系统提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: "warning",
          }

      ).then(() => { //确认
        let n = this.multipleSelection.length;
        for (const department of this.multipleSelection) {
          axios.post("http://localhost:8080/department/deleteById", {
            departmentId: department.departmentId
          }).then(res => {
            if (res.data.isOk) {
              console.log(`部门名称为${department.departmentName}的会议已被删除.`);
              n -= 1;
              //全删除完成后更新部门列表数据，注意下面语句要放到正确的位置
              if (n == 0) {
                this.loadDepartments();
                ElMessage({message: "删除成功", type: "success"});
              }

            }
          });
        }
      }).catch(() => { //取消
        ElMessage({message: "已取消删除~", type: "info"});
      });
    },

    loadDepartments() { //重新从数据库中加载部门列表数据
      //根据当前用户类型来加载部门
      if (this.currentUser.userType == 2) { //超级管理员可以管理所有部门
        axios.get("http://localhost:8080/department/listAll").then(
            res => {
              if (res.data.departmentList != null) {
                this.departmentList = res.data.departmentList;
                console.log("从后端加载的departmentList: ");
                console.log(this.departmentList);
                this.tableData = this.departmentList;
                this.load_showData();
              }
            }
        );
      }
      else {
        axios.post("http://localhost:8080/department/listByUpper", {
          upper: this.currentUser.belongCompany
        }).then(res => {
          if (res.data.departmentList != null) {
            this.departmentList = res.data.departmentList;
            console.log("从后端加载的departmentList: ");
            console.log(this.departmentList);
            this.tableData = this.departmentList;
            this.load_showData();
          }
        });
      }
    },

    loadData() {
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
              this.loadDepartments();

            }
            else {
              ElMessage({message: res.data.msg, type: "warning"});
            }
          }
      );
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