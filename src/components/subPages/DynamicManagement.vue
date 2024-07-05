<template>
  <div class="container">
    
    <div>
      <div class="search-group">
        <div class="sub-title my-2 text-sm text-gray-600">
          新闻标题
        </div>
        <div class="titleInput">
          <el-autocomplete
              v-model="searchQuery"
              :fetch-suggestions="querySearch"
              clearable
              class="inline-input"
              placeholder="请输入新闻标题"
              @select="handleSearchInput"
          />
          <el-button type="primary" @click="handleSearchInput">搜索</el-button>
        </div>
      </div>

      <div class="search-group">
        <div class="sub-title my-2 text-sm text-gray-600">
          新闻作者
        </div>
        <div class="authorInput">
          <el-autocomplete
              v-model="searchQueryAuthor"
              :fetch-suggestions="querySearchAuthor"
              clearable
              class="inline-input"
              placeholder="请输入新闻作者"
              @select="handleSearchInputAuthor"
          />
          <el-button type="primary" @click="handleSearchInputAuthor">搜索</el-button>
        </div>
      </div>

      <div class="search-group">
        <div class="sub-title my-2 text-sm text-gray-600">
          新闻简介
        </div>
        <div class="introInput">
          <el-autocomplete
              v-model="searchQueryIntro"
              :fetch-suggestions="querySearchIntro"
              clearable
              class="inline-input"
              placeholder="请输入新闻简介"
              @select="handleSearchInputIntro"
          />
          <el-button type="primary" @click="handleSearchInputIntro">搜索</el-button>
        </div>
      </div>
      
    </div>

    <el-main>
      <div>
        <el-button type="info" plain icon="Refresh"  @click="resetData" style="font-size: 14px; margin-left: 20px;">重置</el-button>
        <el-button type="primary" :icon="Plus"     plain  @click="showAddForm"> 新增 </el-button>
        <el-button type="success" :icon="Edit"     plain @click="handleEditClick">  修改 </el-button>
        <el-button type="danger"  :icon="Delete"   plain @click="handleBatchDelete">  删除 </el-button>
        <el-button type="warning" :icon="Download" plain @click="exportExcel">  导出 </el-button>
      </div>
    </el-main>
    
    <div>
       <el-table
           ref="multipleTableRef"
           :data="showData" 
           style="width: 100%"
           @selection-change="handleSelectionChange">

         <el-table-column type="selection" width="55" />
    <el-table-column fixed prop="dynamicTitle" label="新闻标题" width="400">
         <template #default="scope">
           <a @click="showDetail(scope.row)">{{ scope.row.dynamicTitle }}</a>
         </template>
    </el-table-column>
    <el-table-column prop="dynamicAuthor" label="作者" width="400" />
    <el-table-column prop="dynamicIntro" label="新闻简介" width="400"/>
    <el-table-column fixed="right" label="Operations" width="200">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="showDetail(scope.row)">
          详情
        </el-button>
        <el-button link type="primary" size="small" @click="showEditForm(scope.row)"> <el-icon> <Edit /> </el-icon>编辑</el-button>
        <el-button link type="primary" size="small" @click="openDelteConfirm(scope.row)"> <el-icon> <Delete /> </el-icon> 删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    </div>
  <div class="demo-pagination-block">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        :size="size"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

    <div>
      <el-dialog
          v-model="detailVisble"
          title="详情页"
          width="1200"
          :before-close="detailClose"
      >
        <span></span>

        <div>
          <el-descriptions
              class="margin-top"
              :column="1"
              :size="size"
              border
          >

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Postcard />
                  </el-icon>
                  标题
                </div>
              </template>
              {{ currentDetail.dynamicTitle }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <user />
                  </el-icon>
                  新闻作者
                </div>
              </template>
              {{ currentDetail.dynamicAuthor }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Notebook/>
                  </el-icon>
                  新闻简介
                </div>
              </template>
              {{ currentDetail.dynamicIntro }}
            </el-descriptions-item>
            
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Calendar />
                  </el-icon>
                  发布时间
                </div>
              </template>
              {{ currentDetail.date }}
            </el-descriptions-item>
            
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Picture />
                  </el-icon>
                  图片
                </div>
              </template>
              <img :src="currentDetail.imgUrl"  style="max-width: 100%; height: auto;">
            </el-descriptions-item>
            
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Document />
                  </el-icon>
                  动态内容
                </div>
              </template>
              <div v-html="currentDetail.dynamicContent"></div>
            </el-descriptions-item>

          </el-descriptions>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button type="danger" plain @click="detailVisble = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>
      
    </div>
    
<!--    添加表单-->
    <div>
      <el-dialog
          v-model="addFormVisble"
          title="添加动态"
          width="1200"
          :before-close="addFormClose"
      >
        <el-form :model="addDynamicForm" :rules="addDynamicFormRules">
          <el-form-item label="新闻标题" prop="dynamicTitle" label-width="120px">
            <el-input type="text" v-model="addDynamicForm.dynamicTitle" placeholder="请输入新闻标题" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="新闻图片" prop="imgUrl" label-width="120px">
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
          
          <p style="margin-top: 0;margin-left: 120px;display: inline">请上传大小不超过</p>
          <p style="color: red; margin-top: 0;display: inline">5MB</p>
          <p style="margin-top: 0;display: inline">格式为</p>
          <p style="color: red; margin-top: 0; display: inline">png/jpg/jpeg</p>
          <p style="margin-top: 0; display: inline">的文件</p>
          
          
          <el-form-item label="新闻内容" prop="dynamicContent">
            <DynamicRichTextEditor v-model="addDynamicForm.dynamicContent"/>
          </el-form-item>
          
<!--          <el-form-item label="新闻内容" prop="dynamicContent" label-width="120px">-->
<!--            <el-input type="textarea" v-model="addDynamicForm.dynamicContent" placeholder="请输入新闻内容" autocomplete="off" :rows="10"></el-input>-->
<!--          </el-form-item>-->

          <el-form-item label="作者" prop="dynamicAuthor" label-width="120px">
            <el-input type="text" v-model="addDynamicForm.dynamicAuthor" placeholder="请输入作者" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="新闻简介" prop="dynamicIntro" label-width="120px">
            <el-input type="text" v-model="addDynamicForm.dynamicIntro" placeholder="请输入新闻简介" autocomplete="off" ></el-input>
          </el-form-item>
          
        </el-form>
        
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="addDynamic">
              添加
            </el-button>
            <el-button @click="addCancel">取消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

<!--    编辑表单-->
    <div>
      <el-dialog
          v-model="editFormVisble"
          title="修改资讯管理"
          width="1200"
          :before-close="editFormClose"
      >
        <el-form :model="editDynamicForm">
          <el-form-item label="新闻标题" prop="editDynamicTitle" label-width="120px">
            <el-input type="text" v-model="editDynamicForm.dynamicTitle" placeholder="请输入新闻标题" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="新闻图片" prop="imgUrl" label-width="120px">
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

          <p style="margin-top: 0;margin-left: 120px;display: inline">请上传大小不超过</p>
          <p style="color: red; margin-top: 0;display: inline">5MB</p>
          <p style="margin-top: 0;display: inline">格式为</p>
          <p style="color: red; margin-top: 0; display: inline">png/jpg/jpeg</p>
          <p style="margin-top: 0; display: inline">的文件</p>

          <el-form-item label="新闻内容" prop="editDynamicContent">
            <DynamicRichTextEditor v-model="editDynamicForm.dynamicContent"/>
          </el-form-item>
          
<!--          <el-form-item label="新闻内容" prop="editDynamicContent" label-width="120px">-->
<!--            <el-input type="textarea" v-model="editDynamicForm.dynamicContent" placeholder="请输入新闻内容" autocomplete="off" :rows="10"></el-input>-->
<!--          </el-form-item>-->

          <el-form-item label="新闻简介" prop="editDynamicIntro" label-width="120px">
            <el-input type="text" v-model="editDynamicForm.dynamicIntro" placeholder="请输入新闻简介" autocomplete="off" ></el-input>
          </el-form-item>
          
        </el-form>

        <template #footer>
          <div class="dialog-footer" >
            <el-button type="primary" @click="editConfirmDialogVisible=true">
              修改
            </el-button>
            <el-button @click="editFormVisble = false">取消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
<!--    修改确认表单-->
    <div>
      <el-dialog
          v-model="editConfirmDialogVisible"
          title="提示"
          width="500"
          align-center
      >
        <span>确定要修改此新闻吗？</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="editCancel">取消</el-button>
            <el-button type="primary" @click="editDynamic">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    
  </div>
  
</template>

<style scoped>
.demo-pagination-block {
  margin-top: 20px; /* 调整分页组件与表格的间距 */
  display: flex;
  justify-content: center; /* 使分页组件居中 */
}

.inline-input{
  width: 150px;
}
.titleInput{
  width: 200px;
  display: flex;
  align-items: center;
  gap: 10px; /* 间距，可以根据需要调整 */
}
.authorInput{
  width: 200px;
  display: flex;
  align-items: center;
  gap: 10px; /* 间距，可以根据需要调整 */
}
.introInput{
  width: 200px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-group {
  display: flex;
  align-items: center;
  gap: 10px; /* 调整为适当的间距 */
  margin-bottom: 10px; /* 调整各组之间的间距 */
}
.inline-input {
  width: 150px;
}

</style>
<script   lang="ts" >
import router from "@/router";
import {ref, onMounted} from "vue";
import {type ComponentSize, ElMessage, SCOPE, type UploadRequestOptions} from 'element-plus'
import axios from "axios";
import {type Conference, type Dynamic, uploadFile} from "@/utilTs/util";
import {getDynamic} from "@/utilTs/util";
import { ElMessageBox } from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import mitt from "mitt";
import {Delete, Download, Edit, Plus} from "@element-plus/icons-vue";
import * as XLSX from 'xlsx';
import tableExcel from 'js-table2excel';
import DynamicRichTextEditor from "@/components/diyComponents/DynamicRichTextEditor.vue";

const emitter = mitt()
export default {
  components: {DynamicRichTextEditor},
  computed: {
    Plus() {
      return Plus
    },
    Edit() {
      return Edit
    },
    Download() {
      return Download
    },
    Delete() {
      return Delete
    }
  },
  // 组合式API部分，存放非数据变量
  setup() {
    const currentPage = ref(1)
    const pageSize = ref(5)
    const size = ref<ComponentSize>('default')
    const background = ref(false)
    const disabled = ref(false)
    const total = ref(0) // 总条目数

    const httpRequest =(options: UploadRequestOptions ) : void=>{
      const fileTo=options.file
      uploadFile(fileTo).then(res=>{
        console.log(res.data.data.links.url)
        emitter.emit('urlChange',res.data.data.links.url); //发出改变信号，即向图床上传图片获得的url
      })
    };
    
    return {
      currentPage,pageSize,size,background,disabled,total,httpRequest
    }

  },
  // 选项式API部分，存放实体数据变量
  data() {
    const dynamics = [] as Dynamic[]
    return {
      dynamics,
      tableData: <Dynamic[]>[],
      showData: <Dynamic[]>[],
      currentPage: 1,
      pageSize: 5,
      searchQuery: '',
      searchQueryAuthor: '',
      searchQueryIntro: '',
      detailVisble: false, //详情页的显示情况
      currentDetail: {} as Dynamic, //当前详情页的数据
      addFormVisble: false, //添加页的显示情况
      editFormVisble: false, //编辑页的显示情况
      editConfirmDialogVisible: false,
      addDynamicForm:{} as Dynamic, 
      editDynamicForm:{} as Dynamic,
      uploadUrl: '',
      eidtUploadUrl: '',
      addDynamicFormRules:{
        dynamicTitle:[
          {required: true, message:"请输入新闻标题", trigger: "blur"}
        ],
        dynamicContent:[
          {required: true, message:"请输入新闻内容", trigger: "blur"}
        ],
        dynamicAuthor:[
          {required: true, message:"请输入新闻作者", trigger: "blur"}
        ],
        dynamicIntro:[
          {required: true, message:"请输入新闻简介", trigger: "blur"}
        ]
      },
      // editDynamicFormRules:{
      //   editDynamicTitle:[
      //     {required: true, message:"请输入新闻标题", trigger: "blur"}
      //   ],
      //   editDynamicContent:[
      //     {required: true, message:"请输入新闻内容", trigger: "blur"}
      //   ],
      //   editDynamicIntro:[
      //     {required: true, message:"请输入新闻简介", trigger: "blur"}
      //   ]
      //  
      // },
      selectedRows: [] as Dynamic[],
    }
  },
  methods: {
    
    handleSizeChange(val: number){
      this.pageSize = val;
      this.filterData();
      this.filterAuthor();
      this.filterIntro();
    },
    handleCurrentChange(val: number) {
      this.currentPage = val;
      this.filterData();
      this.filterAuthor();
      this.filterIntro();
      ElMessage({message: `当前页: ${this.currentPage}`, type: "info"});
    },
    handleSelectionChange(selection: any) {
      this.selectedRows = selection;
    },
    handleEditClick() {
      if (this.selectedRows.length === 0) {
        ElMessage({
          message:"请先选择要编辑的新闻",
          type:"warning"
        });
      } else if (this.selectedRows.length > 1) {
        ElMessage({
          message:"一次只能选择一个新闻编辑",
          type:"warning"
        });
      } else {
        this.showEditForm(this.selectedRows[0]);
      }
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
    handleSearchInput(val: string) {
      //this.searchQuery = val;
      this.filterData();
    },
    handleSearchInputAuthor(){
      this.filterAuthor();
    },
    handleSearchInputIntro(){
      this.filterIntro();
    },
    // handleSelect(item) {
    //   this.searchQuery = item.value;
    //   this.filterData();
    // },
    filterData(){
      const filtered = this.dynamics.filter(dynamic =>
          dynamic.dynamicTitle.includes(this.searchQuery)
      );
      this.total = filtered.length;
      this.showData = filtered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
    filterAuthor(){
      const filtered = this.dynamics.filter(dynamic =>
          dynamic.dynamicAuthor.includes(this.searchQueryAuthor)
      );
      this.total = filtered.length;
      this.showData = filtered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize); 
    },
    filterIntro(){
      const filtered = this.dynamics.filter(dynamic =>
          dynamic.dynamicIntro.includes(this.searchQueryIntro)
      );
      this.total = filtered.length;
      this.showData = filtered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
    querySearch(queryString: string, cb: (results: {value: string}[])=>void){
      const results = this.dynamics
          .filter(dynamic => dynamic.dynamicTitle.includes(queryString))
          .map(dynamic => ({ value: dynamic.dynamicTitle }));
      cb(results);
      
      //console.log(results);
      
    },
    querySearchAuthor(queryString: string, cb: (results: {value: string}[])=>void){
      const results = this.dynamics
          .filter(dynamic => dynamic.dynamicAuthor.includes(queryString))
          .map(dynamic => ({ value: dynamic.dynamicAuthor }));
      cb(results);

      console.log(results);
    },
    querySearchIntro(queryString: string, cb: (results: {value: string}[])=>void){
      const results = this.dynamics
          .filter(dynamic => dynamic.dynamicIntro.includes(queryString))
          .map(dynamic => ({ value: dynamic.dynamicIntro }));
      cb(results);
    },
    detailClose(done: () => void){
      ElMessageBox.confirm('确定关闭此详情页吗?')
          .then(() => {
            done()
          })
          .catch(() => {
            // catch error
          })
    },
    addFormClose(done: () => void){
      ElMessageBox.confirm('确定关闭此添加页吗?')
          .then(() => {
            done()
            this.addDynamicForm = {
              company: "",
              date: "",
              dynamicId: 0,
              dynamicTitle: '',
              dynamicContent: '',
              dynamicAuthor: '',
              dynamicIntro: '',
              imgUrl: ''
            };
          })
          .catch(() => {
            // catch error
          })
    },
    editFormClose(done: () => void){
      ElMessageBox.confirm('确定关闭此修改页吗?')
          .then(() => {
            done()
          })
          .catch(() => {
            // catch error
          })
    },
    addDynamic(){ //添加动态
      if (this.addDynamicForm.dynamicTitle === '' || this.addDynamicForm.dynamicContent === '' ||this.addDynamicForm.dynamicAuthor === '' || this.addDynamicForm.dynamicIntro === '' || this.addDynamicForm.dynamicContent === '<p><br></p>') {
        this.openAddDynamicTipWarn();
      }else{
        this.addDynamicForm.imgUrl = this.uploadUrl;
        axios.post("http://localhost:8080/dynamic/add", this.addDynamicForm).then(res=>{
          if (res.data.status === "200"){
            this.openAddDynamicSuccess();
            this.addFormVisble = false;
            // setTimeout(() => {
            //   emitter.emit('reload');
            // }, 3000);
            this.reloadData();
          }else{
            this.open4();
          }
        });
        this.addDynamicForm = {
          company: "",
          date: "",
          dynamicId: 0,
          dynamicTitle: '',
          dynamicContent: '',
          dynamicAuthor: '',
          dynamicIntro: '',
          imgUrl: ''
        };
        this.load_showData();
      }
    },
    addCancel(){
      this.addFormVisble = false;
      this.addDynamicForm = {
        company: "",
        date: "",
        dynamicId: 0,
        dynamicTitle: '',
        dynamicContent: '',
        dynamicAuthor: '',
        dynamicIntro: '',
        imgUrl: ''
      };
    },
    showDetail(row: Dynamic) {
      this.currentDetail = row;
      this.detailVisble = true;
      console.log(this.currentDetail.imgUrl);
    },
    showAddForm(){
      this.uploadUrl = '';
      this.addFormVisble = true;
    },
    showEditForm(row: Dynamic){
      this.editDynamicForm.dynamicTitle = row.dynamicTitle;
      this.editDynamicForm.imgUrl = row.imgUrl;
      this.editDynamicForm.dynamicContent = row.dynamicContent;
      this.uploadUrl = row.imgUrl;
      this.editDynamicForm.dynamicId = row.dynamicId;
      this.editDynamicForm.dynamicIntro = row.dynamicIntro;
      this.editFormVisble = true;
    },
    editDynamic(){
      this.editConfirmDialogVisible = false;
      this.editDynamicForm.imgUrl = this.uploadUrl;
      this.uploadUrl = '';
      if (this.editDynamicForm.dynamicTitle === '' || this.editDynamicForm.dynamicContent === '' || this.editDynamicForm.dynamicIntro === ''){
        this.editFail();
      }else{
        axios.post("http://localhost:8080/dynamic/edit", this.editDynamicForm).then(res=>{
          if (res.data.status === "200"){
            this.editFormVisble = false;
            this.editSuccess();
            this.reloadData();
          }else{
            this.editFail();
          }
        })
      }
    },
    deleteDynamic(row: Dynamic){
      axios.post("http://localhost:8080/dynamic/delete", row).then(res=>{
        if (res.data.status === "200"){
          ElMessage({
            type: 'success',
            grouping: true,
            message: '删除成功',
          })
          this.reloadData();
        }else{
          alert(res.data.msg);
        }
      })
    },
    handleBatchDelete() {
      const selectedRows = this.selectedRows;
      if (!selectedRows || !selectedRows.length) {
        ElMessage({
          message:"请选择要删除的新闻",
          type:"warning"
        });
        return;
      }

      ElMessageBox.confirm('确定删除选中的新闻吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deletePromises = selectedRows.map(row => this.deleteDynamic(row));
        Promise.all(deletePromises).then(() => {
          // ElMessage({
          //   message: '删除成功',
          //   type: 'success',
          // })
          this.reloadData();
        }).catch(() => {
          ElMessage({
            type: 'error',
            message: '删除失败'
          });
        });
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除'
        });
      });
    },
    openAddDynamicTipWarn(){
      ElMessage({
        message: '警告, 不能有必填项为空！',
        type: 'warning',
      })
    },
    openAddDynamicSuccess(){
      ElMessage({
        message: '添加成功！',
        type: 'success',
      })
    },
    editSuccess(){
      ElMessage({
        message: '修改成功！',
        type: 'success',
      })
    },
    editFail(){
      ElMessage({
        message: '修改失败，不能有必选项为空！',
        type: 'warning',
      })
    },
    open4(){
      ElMessage.error('Oops, this is a error message.')
    },
    openDelteConfirm(row: Dynamic){
      ElMessageBox.confirm(
          '确定删除此新闻?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            this.deleteDynamic(row);
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '删除取消',
            })
          })
    },
    editCancel(){
      this.uploadUrl = '';
      this.addDynamicForm.imgUrl = '';
      this.editDynamicForm.imgUrl = '';
      this.editFormVisble = false;
    },
    reloadData() {
      // 重新加载数据的逻辑
      getDynamic().then((res) => {
        this.dynamics = res;
        this.tableData = res;
        this.load_showData();
        this.total = res.length;
        this.filterData();
      });
    },
    exportExcel(){
      const column = [
        {
          title: "新闻标题",
          key: "dynamicTitle",
          type: "text",
          height: 100
        },
        {
          title: "作者",
          key: "dynamicAuthor",
          type: "text",
          height: 100
        },
        {
          title: "发布时间",
          key: "date",
          type: "text",
          height: 100
        },
        {
          title: "新闻简介",
          key: "dynamicIntro",
          type: "text",
          height: 100
        },
        {
          title: "新闻内容",
          key: "dynamicContent",
          type: "text",
          height: 100
        }
      ];
      const exportData = JSON.parse(JSON.stringify(this.tableData));
      tableExcel(column, exportData, "动态列表");
    },
    resetData(){
      emitter.emit('reload');
    }
    
    
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
    getDynamic().then((res) => {
      console.log(res)
      this.dynamics=res;
      this.tableData=res;
      this.load_showData();
      this.total = res.length; // 设置总条目数
      this.filterData();
      this.filterAuthor();
      this.filterIntro();
      emitter.on('urlChange', e => this.uploadUrl=e as string )
    });
    emitter.on('reload',()=>{
      location.reload();
    })
    
  }
  
}
</script>
