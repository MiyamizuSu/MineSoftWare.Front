
<template>
  <router-view></router-view>

</template>

<style scoped>

</style>
<script   lang="ts" >
import router from "@/router";
export default {
  // 组合式API部分，存放非数据变量
    setup() {
      return {

      }

    },
  // 选项式API部分，存放实体数据变量
  data() {
    return {
    }
  },
  methods: {

  },
  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
      router.push("/mainView")
  }
}
</script>
