<template>
  <el-dialog v-model="isAdd" title="添加课程">
    <div style="display: flex" >
      <el-text style="white-space:nowrap;"> 课程名称</el-text>
      <el-input placeholder="请输入课程名称" style="margin-left: 2%" v-model="newCourse.courseName"></el-input>
    </div>
    <div style="display: flex;margin-top: 2%" >
      <el-text style="white-space:nowrap;"> 课程封面</el-text>
      <el-upload :show-file-list="false" list-type="picture-card" :multiple="false" :auto-upload="false">
          <el-icon><Plus /></el-icon>
        <img>
        <template #file="{ file  }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
        </span>
          </div>
        </template>
      </el-upload>
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
      <el-text style="white-space:nowrap;"> 课程视频</el-text>
      <el-button>
        选取文件
      </el-button>
    </div>
    <div style="display: flex;margin-top: 5%" >
      <el-text style="white-space:nowrap;"> 课程作者</el-text>
      <el-input placeholder="请输入课程作者" style="margin-left: 2%" v-model="newCourse.author"></el-input>
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
        <el-button type="primary" :icon="Plus"     plain  @click="showAddDialog"> 新增 </el-button>
        <el-button type="success" :icon="Edit"     plain>  修改 </el-button>
        <el-button type="danger"  :icon="Delete"   plain>  删除 </el-button>
        <el-button type="warning" :icon="Download" plain @click="exportExcel">  导出 </el-button>
      </div>
      <div>
        <el-table :data="courses" @selection-change="">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="courseCode" label="课程代号" width="100"  />
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
<script   lang="ts" >
import { Edit, Search,Refresh,Plus,Delete,Download } from '@element-plus/icons-vue'
import router from "@/router";
import {ref} from "vue";
import Axios from "axios";
import {type Course} from "@/utilTs/util"
import { saveAs } from 'file-saver';
import type {UploadFile} from "element-plus";
export default {
  // 组合式API部分，存放非数据变量
  setup() {
    const isAdd= ref(false);
    const  showAddDialog=() : void =>{
      isAdd.value=true
    }
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const disabled = ref(false)

    const handleRemove = (file: UploadFile) => {
      console.log(file)
    }

    const handlePictureCardPreview = (file: UploadFile) => {
      dialogImageUrl.value = file.url!
      dialogVisible.value = true
    }

    const handleDownload = (file: UploadFile) => {
      console.log(file)
    }
    return {
      Search,Refresh,Plus,Edit,Delete,Download,isAdd,showAddDialog,handleRemove,handlePictureCardPreview,handleDownload
    }

  },
  // 选项式API部分，存放实体数据变量
  data() {
    const courses=[] as Course[]
    const newCourse={} as Course
    courses.push({
      author:"知更鸟",
      courseCode:"xy24uxai27",
      imgUrl:"https://cdn.picui.cn/vip/2024/06/24/66797d4e8295b.png",
      courseName:"《使一颗心免于哀伤》的歌唱技巧",
      courseCompare:"????",
      courseMediaUrl:"https://cdn.picui.cn/vip/2024/06/24/66797d4e8295b.png",
      courseIntroduction:"银河歌者知更鸟全新专辑《空气蛹INSIDE》正式上线。希望，是一只带有羽毛的东西。它在我的灵魂中筑巢栖息，唱着没有词的歌曲，似乎永远不会停息。",
    },
        {
          author:"景元",
          courseCode:"jsko2294js",
          imgUrl:"https://cdn.picui.cn/vip/2024/06/24/66797d4e8295b.png",
          courseName:"《使一颗心免于控制》的行动技巧",
          courseCompare:"????",
          courseMediaUrl:"https://cdn.picui.cn/vip/2024/06/24/66797d4e8295b.png",
          courseIntroduction:"景元是一名智识命途的雷属性角色。在战斗中景元将召唤「神君」协同作战，施放战技或终结技将为「神君」积累攻击段数。「神君」行动时将根据积累的攻击段数造成伤害并使攻击段数恢复至初始状态。当景元陷入无法战斗状态时【神君】消失。当景元受到控制类负面状态影响时【神君】也无法行动。"
        },
    )
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
        console.log(res.data.type)
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'courses.xlsx');
      })
    },
    insertCourse(){
      Axios.post
    },

  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {

  }
}
</script>