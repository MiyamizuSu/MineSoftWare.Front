
<template>
  <router-view @successLogin="pass">

  </router-view>

</template>

<style scoped>

</style>
<script   lang="ts" >
import router from "@/router";
import {nextTick, provide, ref} from "vue";
import axios from "axios";

export default {
  // 组合式API部分，存放非数据变量
    setup() {
      const isLogin = ref(false);
      const isRouterActive = ref(true)
      return {
        isLogin,isRouterActive,
      }

    },
  // 选项式API部分，存放实体数据变量
  data() {
    return {
    }
  },
provide(){
      return{
        reload: () => {
          this.isRouterActive = false
          nextTick(() => {
            this.isRouterActive= true
          })
        }
      }
},
  methods: {
      pass(){
        this.isLogin= true;
      }
  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
  }
}
</script>
