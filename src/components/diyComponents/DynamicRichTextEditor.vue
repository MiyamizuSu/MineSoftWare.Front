<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
    />
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
    />
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import {onBeforeUnmount, ref, shallowRef, onMounted, watchEffect, watch} from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {ElMessage} from "element-plus";
import {uploadFile} from "@/utilTs/util";
import { DomEditor } from '@wangeditor/editor'

// const toolbar = DomEditor.getToolbar(this.editor);
// const curToolbarConfig = toolbar.getConfig();
// console.log(curToolbarConfig);
// const allMenuKeys = this.editor.getAllMenuKeys();
// console.log(allMenuKeys);



const props = defineProps({
  modelValue:{
    type:String,
    default: '',
  },
})

const emits = defineEmits<{
  (e: "update:modelValue", value:string):void
}>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')
watchEffect(()=>{
  valueHtml.value = props.modelValue;
})
watch(valueHtml, (newHtml) => {
  emits('update:modelValue', newHtml)
})

const toolbarConfig = {
  excludeKeys: [
    'uploadVideo',
    'insertVideo',
    'group-video'
  ]
}
const editorConfig = { 
  placeholder: '请输入内容...',
  MENU_CONF:{
    uploadImage:{
      server: "https://picui.cn/api/v1/upload",
      fieldName: "file",
      // customInsert(res: any, insertFn: any){
      //   console.log("上传图片地址为：");
      //   console.log(res.data.name);
      //   if(res.code === "000000"){
      //     insertFn(res.data.name);
      //   }else{
      //     ElMessage.error("富文本编辑器上传图片失败"); 
      //   }
      // }
      customInsert(res: any,  insertFn: any){
        if (res.status === true){
          insertFn(res.data.links.url);
          ElMessage({
            message: '富文本编辑器上传图片成功',
            type: 'success',
          })
        }else{
          ElMessage.error("富文本编辑器上传图片失败");
        }
      }
    }
    
  }

}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  // console.log("富文本编辑器：");
  // console.log(toolbar.getConfig().toolbarKeys)
}

    


</script>