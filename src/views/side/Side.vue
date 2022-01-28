<template>
    <el-aside width="200px">
      <div class="box">
      <el-menu :default-openeds="openeds">
      <el-submenu index="1">
          <template slot="title">
          <i class="el-icon-setting"></i>
          <span v-show="showSideNav">系统管理</span>
          </template>
          <el-menu-item name="systemInfo" index="1-1" @click="changeViewContent('systemInfo')">系统信息</el-menu-item>
          <el-menu-item name="frontSetting" index="1-2" @click="changeViewContent('frontSetting')">前台设置</el-menu-item>
      </el-submenu>      
      <el-submenu index="2">
          <template slot="title">
          <i class="el-icon-document"></i>
          <span v-show="showSideNav">博客管理</span>
          </template>
          <el-menu-item name="docCategory" index="2-1" @click="changeViewContent('docCategory')">文章分类</el-menu-item>
          <el-menu-item name="docManage" index="2-2" @click="changeViewContent('docManage')">文章管理</el-menu-item>
          <el-menu-item name="docEdit" index="2-3" @click="changeViewContent('docEdit')">编辑文章</el-menu-item>
          <el-menu-item name="docDraft" index="2-4" @click="changeViewContent('docDraft')">草稿箱</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
          <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span v-show="showSideNav">账号管理</span>
          </template>
          <el-menu-item name="adminManage" index="3-1" @click="changeViewContent('adminManage')">账号管理</el-menu-item>
          <el-menu-item name="currentManager" index="3-2" @click="changeViewContent('currentManager')">当前账号</el-menu-item>
      </el-submenu>
      </el-menu>
      <div class="menu-switch">

      </div>
    </div>
  </el-aside>
    
</template>

<script>
export default {
  data(){
    return {
      showSideNav: true,
      openeds: ["1", "2", "3"],
      origin: null,
    }
  },
  mounted(){
    this.origin = document.querySelector(`.el-menu-item[name=${this.$route.path.split("/")[2]}`)
    this.origin && this.origin.classList.add("is-active")
  },
  methods:{
    toggleSideStatus(){
      this.showSideNav = !this.showSideNav;
    },
    changeViewContent(content){
      this.origin.classList.remove("is-active")
      if(this.$route.path == '/manage/'+content) return
      this.$router.push(`/manage/${content}`).catch(()=>{})
    }
  }
}
</script>

<style>
  .el-aside{
    background-color: #eee;
  }
  .menu-switch{

  }
</style>