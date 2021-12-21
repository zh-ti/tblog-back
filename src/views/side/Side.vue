<template>
    <el-aside width="200px">
      <div class="box">
      <el-menu :default-openeds="['1', '2']">
      <el-submenu index="1">
          <template slot="title">
          <i class="el-icon-setting"></i>
          <span v-show="showSideNav">系统管理</span>
          </template>
          <el-menu-item index="1-1" @click="changeViewContent('systemInfo')">系统信息</el-menu-item>
          <el-menu-item index="1-2" @click="changeViewContent('frontSetting')">前台设置</el-menu-item>
      </el-submenu>      
      <el-submenu index="2">
          <template slot="title">
          <i class="el-icon-document"></i>
          <span v-show="showSideNav">博客管理</span>
          </template>
          <el-menu-item index="2-1" @click="changeViewContent('docCategory')">文章分类</el-menu-item>
          <el-menu-item index="2-2" @click="changeViewContent('docManage')">文章管理</el-menu-item>
          <el-menu-item index="2-3" @click="changeViewContent('docEdit')">编辑文章</el-menu-item>
          <el-menu-item index="2-4" @click="changeViewContent('draftBox')">草稿箱</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
          <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span v-show="showSideNav">账号管理</span>
          </template>
          <el-menu-item index="3-1" @click="changeViewContent('adminManage')">账号管理</el-menu-item>
          <el-menu-item index="3-2" @click="changeViewContent('curAdmin')">当前账号</el-menu-item>
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
    }
  },
  methods:{
    toggleSideStatus(){
      this.showSideNav = !this.showSideNav;
    },
    changeViewContent(content){
      this.$router.push(content)
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