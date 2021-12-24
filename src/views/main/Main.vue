<template>
  <el-main v-loading="$store.state.loading">
    <router-view></router-view>
  </el-main>
</template>

<script>
// el-main 待加属性：v-loading="$store.state.loading"

export default {
  data(){
    return {
      loading: true,
    }
  },
  
}
</script>

<style>
  ::-webkit-scrollbar {
    height: 10px !important;
  }
</style>