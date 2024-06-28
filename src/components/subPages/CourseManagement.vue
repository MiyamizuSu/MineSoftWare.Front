<template>
  <el-dialog v-model="isAdd" :title=judgeType draggable>
    <div style="display: flex" >
      <el-text style="white-space:nowrap;"> 课程名称</el-text>
      <el-input placeholder="请输入课程名称" style="margin-left: 2%" v-model="newCourse.courseName"></el-input>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap;"> 课程封面</el-text>
      <el-upload  :file-list="imgList" :show-file-list="true" list-type="picture-card" :multiple="false" :auto-upload="false" :limit=1 style="margin-left: 2%" :http-request="httpRequest"
                  ref="uploadRef"
      >
          <el-icon v-if="isNeedPlus" ><Plus /></el-icon>
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
      <el-upload style="margin-left: 2%" :auto-upload="false" :onchange="changeCallBack" :file-list="videoList"
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
      <el-button type="primary"  @click="submitMessage()">确认</el-button>
    </div>
  </el-dialog>
  <el-container>
    <el-header height="40px">
      <div style="display:flex">
        <div style="display:inline-flex;white-space:nowrap;">
          <el-text style="width: max-content"> 课程名称</el-text>
          <el-input placeholder="请输入课程名称" style="margin-left: 5%; "></el-input>
        </div>
        <div style="display:inline-flex;white-space:nowrap; margin-left: 1%" >
          <el-text style="width: max-content"> 课程排序</el-text>
          <el-input placeholder="请输入课程排序" style="margin-left: 5%; "></el-input>
        </div>
        <div style="margin-left: 1%">
          <el-button type="primary" :icon="Search" bg text>搜索</el-button>
          <el-button type="info" :icon="Refresh" bg text> 重置</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div>
        <el-button type="primary" :icon="Plus"     plain  @click="showAddDialog('1')"> 新增 </el-button>
        <el-button type="success" :icon="Edit"     plain @Click="showAddDialog('2')" >  修改 </el-button>
        <el-button type="danger"  :icon="Delete"   plain>  删除 </el-button>
        <el-button type="warning" :icon="Download" plain @click="exportExcel">  导出 </el-button>
      </div>
      <div>
        <el-table :data="courses" @selection-change="selected">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="courseCode" label="课程代号" width="130"  />
          <el-table-column prop="courseName" label="课程名称"  />
          <el-table-column prop="courseIntroduction" label="课程简介" />
          <el-table-column width="200">
            <template #header>
              操作
            </template>
            <template #default>
              <el-button type="primary" :icon="Edit" text>修改</el-button>
              <el-button type="primary" :icon="Delete" text>删除</el-button>
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
import {Delete, Download, Edit, Plus, Refresh, Search} from '@element-plus/icons-vue'
import {ref, watch} from "vue";
import Axios from "axios";
import {type Course, getSignatrue, uploadFile} from "@/utilTs/util"
import TcVod from 'vod-js-sdk-v6'
import {saveAs} from 'file-saver';
import {
  ElMessage,
  type UploadFile,
  type UploadFiles,
  type UploadInstance,
  type UploadRequestOptions,
  type UploadUserFile
} from "element-plus";
import mitt from "mitt";

const emitter = mitt()
export default {
  // 组合式API部分，存放非数据变量
  setup() {
    const isAdd= ref(false);
    const isPreview = ref(false)
    const disabled = ref(false)
    const tempUrl=ref("")
    const isNeedPlus=ref(true)
    const imgList=ref<UploadUserFile[]>([])
    const videoList=ref<UploadUserFile[]>([])
    const uploadRef = ref<UploadInstance>()
    const uploadRefV = ref<UploadInstance>()
    const signature=ref("")
    const imgUrlChanged=ref(false)
    const videoUrlChanged=ref(false)
    const editType=ref("1")
    const canAdd=ref(true)
    const preview= (e : UploadFile)  =>{
      tempUrl.value=e.url!
      isPreview.value=true;
    }
    const toVod=new TcVod({
      getSignature: getSignatrue,
    });
    const  showAddDialog=(e:string) : void =>{
      if(e==='2'){
        if(canAdd.value===true){
          ElMessage({
            message:"请至少选择一项",
            type:"error"
          })
        }
        else{

        }
      }
      else{
        editType.value=e
        isAdd.value=true
      }
    }
    const changeCallBack=(uploadFile: UploadFile, uploadFiles: UploadFiles)=>{

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
      disabled,imgList,changeCallBack, httpRequest,uploadRef,
      toVod,videoList,httpRequestV,imgUrlChanged,videoUrlChanged,uploadRefV,editType,canAdd
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
  }
}
,
  // 选项式API部分，存放实体数据变量
  data() {
    const courses=[] as Course[]
    const newCourse={} as Course
    return {
      courses,newCourse
    }
  },
  methods: {
    exportExcel(){
      Axios.post("http://localhost:8080/Course/getExcel",this.courses,{
        responseType: 'blob',
        withCredentials:true
      }).then((res) => {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'courses.xlsx');
      })
    },
    submitMessage(){
      if(this.videoList.length===0&&this.imgList.length!==0){
        this.videoUrlChanged=true
        this.uploadRef.submit()
      }
      else if(this.videoList.length!==0&&this.imgList.length===0){
        this.imgUrlChanged=true
        this.uploadRefV.submit();
      }
      else if(this.videoList.length===0&&this.imgList.length===0){
        console.log(111111111)
        Axios.post("http://localhost:8080/Course/addNewCourse",this.newCourse).then((res)=>{
          if(res.status === 200){
            if(res.data.statusCode==="200"){
              ElMessage({
                message:"添加成功",
                type:"success",
              })
              this.imgUrlChanged=false;
              this.videoUrlChanged=false;
            }
          }
        })
      }
      else{
        this.uploadRef.submit()
        this.uploadRefV.submit();
      }
    },
    selected(newSelection : Course[]){
      console.log(newSelection)
      if(newSelection.length===0){
        this.newCourse={} as Course;
      }
      else{
        this.canAdd=false
        this.newCourse=newSelection[0];
      }
    }
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
    emitter.on("urlChange", e=>{
      this.newCourse.imgUrl=e as string
    })
    emitter.on('videoUrlChange',e=>{
      this.newCourse.courseMediaUrl=e as string
    })
    const handleToback=():void=>{
      Axios.post("http://localhost:8080/Course/addNewCourse",this.newCourse).then((res)=>{
        if(res.status === 200){
          if(res.data.statusCode==="200"){
            ElMessage({
              message:"添加成功",
              type:"success",
            })
            this.imgUrlChanged=false;
            this.videoUrlChanged=false;
          }
        }
      })
    }
    watch(()=>this.newCourse.courseMediaUrl, ()=>{
      this.videoUrlChanged=true;
      if(this.videoUrlChanged&&this.imgUrlChanged &&this.canAdd ){
        handleToback()
      }
    })
    watch(()=>this.newCourse.imgUrl, ()=>{
      this.imgUrlChanged=true;
      if(this.videoUrlChanged&&this.imgUrlChanged &&this.canAdd){
        handleToback()
      }
    })
    Axios.post("http://localhost:8080/Course/list",{},{
      withCredentials:true
    }).then((res)=>{
      this.courses=res.data.courses
    })
  }
}
</script>