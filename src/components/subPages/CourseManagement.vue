<template>
  <el-dialog v-model="isAdd" :title=judgeType draggable>
    <div style="display: flex" >
      <el-text style="white-space:nowrap;"> 课程名称</el-text>
      <el-input placeholder="请输入课程名称" style="margin-left: 2%" v-model="newCourse.courseName"></el-input>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap;"> 课程封面</el-text>
      <el-upload  :show-file-list="true" list-type="picture-card" :multiple="false" :auto-upload="false" :limit=1 style="margin-left: 2%" :http-request="httpRequest"
                  ref="uploadRef"
                  :before-remove="beUpload"
                  :on-change="bechange"
                  :before-upload="checkFile"
      >
          <el-icon v-if="isNeedPlus" ><Plus /></el-icon>
        <template #tip>
          <div class="el-upload__tip" style="color: red">
            jpg/png 文件 小于10MB
          </div>
        </template>
      </el-upload>
      <el-dialog v-model="isPreview">
        <img w-full :src="tempUrl" alt="Preview Image" />
      </el-dialog>
    </div>
    <div style="display: flex;margin-top: 2%"  >
      <el-text style="white-space:nowrap;"> 课程简介</el-text>
      <el-input placeholder="请输入课程简介" type="textarea" style="margin-left: 2% " v-model="newCourse.courseIntroduction"></el-input>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap;"> 课程排序</el-text>
      <el-input placeholder="请输入课程排序" style="margin-left: 2%" v-model="newCourse.courseCompare"></el-input>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap; "> 课程视频</el-text>
      <el-upload style="margin-left: 2%" :auto-upload="false" :onchange="changeCallBack" :before-remove="beUploadV"
                 :http-request="httpRequestV"
                 ref="uploadRefV"
      >
        <template #trigger>
          <el-button > 选取文件 </el-button>
        </template>
      </el-upload>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap;"> 课程作者</el-text>
      <el-input placeholder="请输入课程作者" style="margin-left: 2%" v-model="newCourse.author"></el-input>
    </div>
    <div style="display: flex;margin-top: 5%; margin-left: 45%" >
      <el-button type="primary" v-if="editType==='1'"  @click="submitMessage()" >确认</el-button>
      <el-button type="primary" v-else  @click="updateMessage">确认</el-button>
    </div>
    <div v-if="isLoading" >
      <el-progress v-if="loadingP!==100" :percentage="loadingP" />
        <el-progress v-else-if="loadingP===100" :percentage="100" status="success" />
    </div>
  </el-dialog>
  <el-dialog v-model="isShow" title="课程信息" draggable align-center @opened="setUrl" destroy-on-close>
    <div style="display: flex" >
      <el-text style="white-space:nowrap;"> 课程名称</el-text>
      <el-text style="margin-left: 2%">{{courseShow.courseName}}</el-text>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap;"> 课程封面</el-text>
      <img :src="defaultUrl" v-if="courseShow.imgUrl===null">
      <img v-else :src="courseShow.imgUrl" width="40%" height="40%" style="margin-left: 2%;max-height: 40%;max-width: 40%"  />
    </div>
    <div style="display: flex;margin-top: 2%"  >
      <el-text style="white-space:nowrap;"> 课程简介</el-text>
      <el-text style="margin-left: 2%">{{courseShow.courseIntroduction}}</el-text>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap;"> 课程排序</el-text>
      <el-text style="margin-left: 2%">{{courseShow.courseCompare}}</el-text>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap; "> 课程视频</el-text>
      <video-player :options="videoOptions" />
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap;"> 课程作者</el-text>
      <el-text style="margin-left: 2%">{{courseShow.author}} </el-text>
    </div>
  </el-dialog>
  <el-container>
    <el-header height="40px" >
      <div style="display:flex">
        <div style="display:inline-flex;white-space:nowrap;">
          <el-text style="width: max-content"> 课程名称</el-text>
          <el-autocomplete placeholder="请输入课程名称" style="margin-left: 5%;"
                           v-model="nameSearch" :fetch-suggestions="fetchSugName"
                           :trigger-on-focus="false"
                           value-key="courseName"
          ></el-autocomplete>
        </div>
        <div style="display:inline-flex;white-space:nowrap; margin-left: 1%" >
          <el-text style="width: max-content"> 课程排序</el-text>
          <el-input placeholder="请输入课程排序" style="margin-left: 5%; "
                           v-model="compareSearch"
          ></el-input>
        </div>
        <div style="margin-left: 1%">
          <el-button type="primary" :icon="Search" bg text @click="searchCourse" >搜索</el-button>
          <el-button type="info" :icon="Refresh" bg text @click="reset"> 重置</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div>
        <el-button type="primary" :icon="Plus" :disabled="judgeUserType"  plain  @click="showAddDialog('1')"> 新增 </el-button>
        <el-button type="success" :icon="Edit"     plain @Click="showAddDialog('2')" >  修改 </el-button>
        <el-button type="danger"  :icon="Delete"   plain @click="beforeDelete(beDeletedList)" >  删除 </el-button>
        <el-button type="warning" :icon="Download" plain @click="exportExcel">  导出 </el-button>
      </div>
      <div>
        <el-table :data="coursesView" @selection-change="selected" @cell-mouse-enter="hoverChange" @cell-dblclick="cellClick" height="690px">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="courseCode" label="课程代号" width="130"  />
          <el-table-column prop="courseName" label="课程名称"  />
          <el-table-column prop="courseIntroduction" label="课程简介" />
          <el-table-column prop="status" label="审核状态" width="200">
          <template #default="scope" >
            <el-text>{{statusNumberToString[scope.row.status as string] }}</el-text>
          </template>

          </el-table-column>
          <el-table-column width="200">
            <template #header>
              <div style="margin-left: 10%">
                操作
              </div>

            </template>
            <template #default>
              <el-button type="primary" :icon="Edit" text @click="changeSingle" >修改</el-button>
              <el-button type="primary" :icon="Delete" text @click="removeSingle">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column v-if="userType===2"  width="200">
            <template #header style="margin-left: 5%">
              <div style="margin-left: 10%;">
                审核
              </div>
            </template>
            <template #default>
              <el-button type="primary" :icon="Select" text @click="checkPass('yes')" ></el-button>
              <el-button type="primary" :icon="Close" text @click="checkPass('no')"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
<script   lang="ts">
import {Delete, Download, Edit, Plus, Refresh, Search,Select,Close} from '@element-plus/icons-vue'
import {inject, ref, watch} from "vue";
import Axios from "axios";
import {type Course, getSignatrue, uploadFile,momoSearch} from "@/utilTs/util"
import TcVod from 'vod-js-sdk-v6'
import {saveAs} from 'file-saver';
import VideoPlayer from "@/components/diyComponents/VideoJs.vue";


import {
  ElMessage, ElMessageBox,
  type UploadFile,
  type UploadFiles,
  type UploadInstance, type UploadProps,
  type UploadRequestOptions
} from "element-plus";
import mitt from "mitt";
import videojs from "video.js";

const emitter = mitt()

function filterArray(arr: string[], input: string): string[] {
  return arr.filter(item => item.includes(input));
}

export default {
  components: {VideoPlayer},
  // 组合式API部分，存放非数据变量
  setup() {
    const isAdd= ref(false);
    const isPreview = ref(false)
    const isLoading=ref(false)
    const loadingP=ref(0)
    const disabled = ref(false)
    const tempUrl=ref("")
    const isNeedPlus=ref(true)
    const imgListCount=ref(0)
    const videoListCount=ref(0)
    const uploadRef = ref<UploadInstance>()
    const uploadRefV = ref<UploadInstance>()
    const signature=ref("")
    const imgUrlChanged=ref(false)
    const videoUrlChanged=ref(false)
    const editType=ref("1")
    const canAdd=ref(true)
    const selectCount=ref(0)
    const beDeletedList =ref([] as Course[])
    const beDeletedSingle=ref<Course>({} as Course)
    const nameSearch=ref("")
    const compareSearch=ref("")
    const isShow=ref(false)

    const beUpload= (uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
      imgListCount.value=imgListCount.value - 1

    }
    const bechange = ()=>{
      imgListCount.value=imgListCount.value + 1
    }

    const preview= (e : UploadFile)  =>{
      tempUrl.value=e.url!
      isPreview.value=true;
    }
    const toVod=new TcVod({
      getSignature: getSignatrue,
    });
    const  showAddDialog=(e:string) : void =>{
      if(selectCount.value>1){
        ElMessage({
          message:"多选时不允许更改",
          type:"warning",
        })
      }
      else{
        editType.value=e
        if(e==='2'){
          if(selectCount.value===0){
            ElMessage({
              message:"请至少选择一项",
              type:"error"
            })
          }
          else{
            isAdd.value=true
          }
        }
        else{
          isAdd.value=true
        }
      }
    }

    const checkFile: UploadProps['beforeUpload'] = (rawFile) => {
      const typeList = ['image/jpeg', 'image/png']
      const isTypeValid = typeList.includes(rawFile.type)
      if (!isTypeValid) {
        ElMessage.error('文件必须是JPG/PNG 格式!')
        return false
      }
      else if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error('大小不能超过 10MB!')
        return false
      }
      return true
    }


    const changeCallBack=(uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
      videoListCount.value=videoListCount.value - 1
    }
    const beUploadV=()=>{
      videoListCount.value=videoListCount.value + 1
    }
    const httpRequest=( options: UploadRequestOptions) :void=>{
      const fileTo=options.file
      uploadFile(fileTo).then((res)=>{
        if(res.status === 200){
          emitter.emit('urlChange',res.data.data.links.url);
        }
        else{

        }
      })
    }
    const httpRequestV=( options: UploadRequestOptions) :void=>{
      const uploader=toVod.upload({
        mediaFile:options.file
      })
      uploader.on('media_progress', function(info) {
        console.log(info.percent) // 进度
        loadingP.value=info.percent*100
      })
      uploader.done().then(function (doneResult) {
        doneResult.video.url
        emitter.emit('videoUrlChange',doneResult.video.url);
      }).catch(function (err) {

      })

    }
    return {
      Search,Refresh,Plus,Edit,Delete,
      Download,isAdd,showAddDialog,
      tempUrl,isNeedPlus,isPreview,preview,
      disabled,imgListCount,changeCallBack, httpRequest,uploadRef,
      toVod,videoListCount,httpRequestV,imgUrlChanged,videoUrlChanged,uploadRefV,editType,canAdd,selectCount,beUpload,
      bechange,beUploadV,beDeletedList,beDeletedSingle,nameSearch,compareSearch,isShow,checkFile,Select,Close,isLoading,loadingP
    }

  },
computed:{
  judgeType () {
    if(this.editType=="1"){
      return "添加课程"
    }
    else if ( this.editType==="2"){
      return "修改课程"
    }
  },
  judgeUserType(){
    if(this.userType===1){
      return false;
    }
    else if(this.userType===2){
      return true;
    }
  }
}
,props:{
  },
  // 选项式API部分，存放实体数据变量
  data() {
    const courses=[] as Course[]
    const newCourse={} as Course
    const coursesView=[] as Course[]
    const coursesTemp=[] as Course[]
    const courseShow={} as Course
    const defaultUrl="https://cdn.picui.cn/vip/2024/06/29/6680109d3b19c.png"
    const statusNumberToString :{[key: string] : string} = {
      "0":"待审核",
     "1":"审核通过",
     "2":"审核不通过"
    }
    return {
      courses,newCourse,userType:1,coursesView,coursesTemp,courseShow,defaultUrl,statusNumberToString,
      videoOptions: {
        autoplay: false,
        controls: true,
        sources: [
          {
            src:
                '',
            type: 'video/mp4'
          }
        ]
      }
    }
  },
  methods: {
    searchCourse(){
      this.coursesView = this.coursesTemp.filter(course => course.courseCompare === this.compareSearch);
      ElMessage({
        message:"共找到"+this.coursesView.length+"条数据",
        type:'info'
      })
      if(this.coursesView.length===0){
        setTimeout(()=>{
          this.coursesView=this.coursesTemp
        },1500)
      }
    },
    fetchSugName(queryString: string, callback: any){
      callback(this.coursesView);
    }
  ,
    exportExcel(){
      const courseExcel = this.coursesView.map(course => {
        return {
          ...course,
          status: this.statusNumberToString[course.status as string]
        };
      });
      Axios.post("http://localhost:8080/Course/getExcel",courseExcel,{
        responseType: 'blob',
        withCredentials:true
      }).then((res) => {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'courses.xlsx');
      })
    },
    setUrl(){
      this.videoOptions.sources[0].src=this.courseShow.courseMediaUrl
    }
  ,
    cellClick(row: any, column: any, cell: HTMLTableCellElement, event: Event){
      if(column.label==="课程名称"){
        this.courseShow=row as Course
        this.videoOptions.sources[0].src=this.courseShow.courseMediaUrl
        this.isShow=true
      }
    },
    submitMessage(){
      this.isLoading=true
      console.log("信息添加")
      this.canAdd=true
      if(this.imgListCount===0&&this.videoListCount===0){
        if(this.newCourse.courseName!==''||this.newCourse.courseIntroduction!==''||this.newCourse.courseCompare!==''||this.newCourse.author!==''){
          ElMessage({
            message:"输入框内所填内容不许为空",
            type:"warning",
          })
        }
        else {
          Axios.post("http://localhost:8080/Course/addNewCourse", this.newCourse).then((res) => {
            if (res.status === 200) {
              if (res.data.statusCode === "200") {
                ElMessage({
                  message: "添加成功",
                  type: "success",
                })
                this.imgUrlChanged = false;
                this.videoUrlChanged = false;
                setTimeout(() => {
                  emitter.emit('someThingChange')
                }, 1000)
              }
            }
          })
        }
      }
      else if(this.imgListCount!==0&&this.videoListCount===0){
        this.videoUrlChanged=true
        this.uploadRef.submit()
      }
      else if(this.imgListCount===0&&this.videoListCount!==0){
        this.imgUrlChanged=true
        this.uploadRefV.submit()
      }
      else{
        this.uploadRef.submit()
        this.uploadRefV.submit()
      }
    },
    updateMessage(){
      this.isLoading=true
      console.log("信息更新")
      this.canAdd=true
      if(this.imgListCount===0&&this.videoListCount===0){
        if(this.newCourse.courseName!==''||this.newCourse.courseIntroduction!==''||this.newCourse.courseCompare!==''||this.newCourse.author!==''){
          ElMessage({
            message:"输入框内所填内容不许为空",
            type:"warning",
          })
        }
        else {
          Axios.post("http://localhost:8080/Course/updateCourse", this.newCourse, {
            withCredentials: true
          }).then((res) => {
            if (res.status === 200) {
              if (res.data.statusCode === "200") {
                ElMessage({
                  message: "修改成功",
                  type: "success",
                })
                this.imgUrlChanged = false;
                this.videoUrlChanged = false;
                setTimeout(() => {
                  emitter.emit('someThingChange')
                }, 1000)
              }
            }
          })
        }
      }
      else if(this.imgListCount!==0&&this.videoListCount===0){
        this.videoUrlChanged=true
        this.uploadRef.submit()
      }
      else if(this.imgListCount===0&&this.videoListCount!==0){
        this.imgUrlChanged=true
        this.uploadRefV.submit()
      }
      else{
        this.uploadRef.submit()
        this.uploadRefV.submit()
      }
    }
  ,
    selected(newSelection : Course[]){
      this.beDeletedList=newSelection;
      this.selectCount = newSelection.length
      if(newSelection.length===0){
        this.newCourse={} as Course;
      }
      else{
        this.canAdd=false
        this.newCourse=newSelection[0];
      }
    },
  hoverChange(row: any){
      this.beDeletedSingle=row as Course;
  }
  ,
    reset(){
      emitter.emit('someThingChange')
    }
  ,
    beforeDelete( DeletedList : Course[]){
      var nameString=""
      DeletedList.forEach(item=>{
        nameString+=item.courseName+'('+item.courseCode+')'+"\n"
      })
      ElMessageBox.confirm(
          '要删除'+nameString+'这'+this.beDeletedList.length+'项吗',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
      ).then(() => {
            Axios.post("http://localhost:8080/Course/removeCourse",DeletedList,{
              withCredentials:true
            }).then((res) => {
              if(res.status === 200){
                if(res.data.statusCode==="200"){
                  ElMessage({
                    type:"success",
                    message:"删除成功"
                  })
                  setTimeout(()=>{
                    emitter.emit('someThingChange')
                  },1000)
                }
              }
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
    },
    removeSingle(){
      const removeList = [] as Course[]
      removeList.push(this.beDeletedSingle)
      this.beforeDelete(removeList)
    },
    changeSingle(){
      this.newCourse=this.beDeletedSingle
      this.isAdd=true;
      this.canAdd=false
      this.editType="2"
    },
    checkPass(e : string){
      ElMessageBox.confirm(
          '要审核这个课程吗',
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {

        if(e==="yes"){
          this.beDeletedSingle.status="1"
        }
        else{
          this.beDeletedSingle.status="2"
        }
        Axios.post("http://localhost:8080/Course/checkPassed",this.beDeletedSingle,{
          withCredentials:true
        }).then((res)=>{
          if(res.status === 200){
            if(res.data.statusCode==="501"){
              ElMessage({
                message:"已审核通过",
                type:"success"
              })
            }
            else if(res.data.statusCode==="502"){
              ElMessage({
                message:"已审核不通过",
                type:"success"
              })
            }
          }
        })
      }).catch(() => {
            ElMessage({
              type: 'info',
              message: '取消',
            })
          })
    }
  },
inject:['reload'],
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
    emitter.on("urlChange", e=>{
      this.newCourse.imgUrl=e as string
    })
    emitter.on('videoUrlChange',e=>{
      this.newCourse.courseMediaUrl=e as string
    })
    emitter.on('someThingChange',()=>{
      location.reload()
    })
    const queryValue = this.$route.query.ee;
    if (Array.isArray(queryValue)) {
      
    }
    else if (queryValue !== undefined) {
      this.userType = parseInt(queryValue as string, 10) || 0;
    }
    const handleToback=():void=>{
      if(this.newCourse.courseName!==''||this.newCourse.courseIntroduction!==''||this.newCourse.courseCompare!==''||this.newCourse.author!==''){
        ElMessage({
          message:"输入框内所填内容不许为空",
          type:"warning",
        })
      }
      else {
        Axios.post("http://localhost:8080/Course/addNewCourse", this.newCourse).then((res) => {
          if (res.status === 200) {
            if (res.data.statusCode === "200") {
              ElMessage({
                message: "添加成功",
                type: "success",
              })
              this.imgUrlChanged = false;
              this.videoUrlChanged = false;
            }
          }
        })
      }
    }
    const handleTobackUP=():void=>{
      if(this.newCourse.courseName!==''||this.newCourse.courseIntroduction!==''||this.newCourse.courseCompare!==''||this.newCourse.author!==''){
        ElMessage({
          message:"输入框内所填内容不许为空",
          type:"warning",
        })
      }
      else {
        Axios.post("http://localhost:8080/Course/updateCourse", this.newCourse).then((res) => {
          if (res.status === 200) {
            if (res.data.statusCode === "200") {
              ElMessage({
                message: "修改成功",
                type: "success",
              })
              this.imgUrlChanged = false;
              this.videoUrlChanged = false;
            }
          }
        })
      }
    }
    watch(()=>this.newCourse.courseMediaUrl, ()=>{
      this.videoUrlChanged=true;
      if(this.videoUrlChanged&&this.imgUrlChanged &&this.canAdd ){
        if(this.editType==="1"){
          handleToback()
        }
        else{
          handleTobackUP()
        }
      }
    })
    watch(()=>this.newCourse.imgUrl, ()=>{
      this.imgUrlChanged=true;
      if(this.videoUrlChanged&&this.imgUrlChanged && this.canAdd ){
        if(this.editType==="1"){
          handleToback()
        }
        else{
          handleTobackUP()
        }
      }
    })
    watch(()=>this.nameSearch,()=>{
      if(this.nameSearch===""){
        this.coursesView=this.courses
        this.coursesTemp=this.courses
      }
      else{
        this.coursesView=momoSearch(this.courses,this.nameSearch);
        this.coursesTemp=momoSearch(this.courses,this.nameSearch);
      }
    })
    watch(()=>this.compareSearch,()=>{
      if(this.nameSearch!==""){
        if(this.compareSearch===""){
          this.coursesView=this.coursesTemp
        }
      }
      else{
        if(this.compareSearch===""){
            this.coursesView=this.courses
        }
      }
    })
    Axios.post("http://localhost:8080/Course/list",{},{
      withCredentials:true
    }).then((res)=>{
      console.log(res)
      this.courses=res.data.courses
      this.coursesView=res.data.courses
    })
  }
}
</script>-