<template>
  <div id="doc-manage">
        <el-button @click="clearFilter">清除所有过滤器</el-button>
        <el-button @click="addDoc">添加文章</el-button>

        <el-table
            ref="documents"
            :data="tableData"
            style="width: 100%"
            height="75vh"
            >

            <el-table-column
            fixed="left"
            prop="title"
            label="标题"
            min-width="200"
            >
            </el-table-column>

            <el-table-column
            prop="browses"
            sortable
            width="100"
            label="浏览数">
            </el-table-column>

            <el-table-column
            prop="likes"
            sortable
            width="100"
            label="点赞数">
            </el-table-column>

            <el-table-column
            prop="comments"
            sortable
            width="100"
            label="评论数">
            </el-table-column>

            <el-table-column
            prop="state"
            sortable
            label="状态"
            width="100"
            >
              <template slot-scope="scope">
                <el-link v-if="scope.row.state === 1" type="success" href="https://zh-ti.top" target="_blank">已发布</el-link>
                <el-link v-if="scope.row.state === 0" type="danger" disabled>未发布</el-link>
              </template>
            </el-table-column>

            <el-table-column
            prop="category"
            label="分类"
            width="180"
            sortable
            :filters="docCategoryFilters"
            :filter-method="docCategoryFilter"
            >
            </el-table-column>

            <el-table-column
            prop="publishFullDate"
            label="发布时间"
            sortable
            width="180"
            :filters="dateFilters"
            :filter-method="publishDateFilter"
            >
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.publishFullDate }}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="操作"
            width="210"
            fixed="right"
            >
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="editDoc(scope.row)">编辑</el-button>
                    <el-button
                    v-if="scope.row.state === 1"
                    size="mini"
                    @click="withdrawDoc(scope.row)"
                    type="warning">撤回</el-button>
                    <el-button
                    v-if="scope.row.state === 0"
                    size="mini"
                    type="danger"
                    @click="deleteDoc(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
  </div>
</template>

<script>
    import documents from 'data/document'

  export default {
    data() {
      return {
        tableData: documents,
        dateFilters: [
            {text: '2021-12-21', value: '2021-12-21'}, 
            {text: '2016-05-02', value: '2016-05-02'}, 
            {text: '2016-05-03', value: '2016-05-03'}, 
            {text: '2016-05-04', value: '2016-05-04'}
        ],
        docCategoryFilters: [
            {text: "C", value: 'c'},
            {text: 'JavaScript', value: 'javascript'},
            {text: 'Java', value: 'java'},
            {text: 'Vue', value: 'vue'}
        ]
      }
    },
    beforeRouteLeave(to, from, next){
      this.$store.commit('changeLoadState', true)
      next()
    },
    methods: {
      clearFilter(event) {
        this.$refs.documents.clearFilter()
        event.target.blur()
      },
      docCategoryFilter(value, row){
          return value === row.category
      },
      publishDateFilter(value, row) {
        return row.publishDate.indexOf(value) != -1
      },
      addDoc(){
          this.$router.push('/docEdit')
      },
      editDoc(payload){
        this.$router.push(`/docEdit/${payload.id}`)
      },
      withdrawDoc(payload){
          this.$confirm(`确定要撤回已发布的文章 “${payload.title}” 到草稿箱吗吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消撤销文章'
            });          
            });
      },
      deleteDoc(payload){
          this.$confirm(`确定要删除已发布的文章 “${payload.title}” 吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除文章'
            });          
            });
      }
    }
  }
</script>