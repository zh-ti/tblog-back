<template>
    <div class="main-view">
        <el-container class="header">
            <Header></Header>
        </el-container>
        <el-container  class="main-container">
            <Side />
            <Main />
        </el-container>
    </div>
</template>

<script>
import Header from 'views/header/Header'
import Side from 'views/side/Side'
import Main from "views/main/Main"

export default {
    components: {
        Header,
        Side,
        Main
    }
}
</script>

<style socped>
    .main-view{
        width: 100vw;
        height: 100vh;
    }
    .main-container{
        height: calc(100vh - 80px);
    }
    .el-container{
        min-width: 700px
    }
</style>