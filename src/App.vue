
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
      // console.log(this.isLogin);
      // if (!this.isLogin){
      //  router.push("/basicView");
      // }
      // else{
      //   router.push("/mainView")
      // }
    // axios.post("http://localhost:8080/checkSession",{},{
    //   withCredentials: true
    // }).then((res=>{
    //   if (res.status == 200) {
    //     console.log(res.data);
    //     if (res.data.statusCode === 200) {
    //       router.push("/mainView");
    //     }
    //     else{
    //       router.push("/basicView");
    //     }
    //   }
    // }))


  }
}
</script>
