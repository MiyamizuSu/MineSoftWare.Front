
<template>
  <router-view @successLogin="pass">

  </router-view>

</template>

<style scoped>

</style>
<script   lang="ts" >
import router from "@/router";
import {ref} from "vue";
import axios from "axios";
export default {
  // 组合式API部分，存放非数据变量
    setup() {
      const isLogin = ref(false);
      return {
        isLogin
      }

    },
  // 选项式API部分，存放实体数据变量
  data() {
    return {
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
