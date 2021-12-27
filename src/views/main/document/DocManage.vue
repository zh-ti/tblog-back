<template>
  <div id="doc-manage">
        <el-button @click="clearFilter">清除所有过滤器</el-button>
        <el-button @click="addDoc">添加文章</el-button>
        <el-button @click="refreshData">刷新</el-button>

        <el-table
            ref="documents"
            :data="tableData"
            style="width: 100%"
            height="75vh"
            >
             <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item label="文章标题">
                    <span>{{ props.row.title }}</span>
                  </el-form-item>
                  <el-form-item label="浏览数量">
                    <span>{{ props.row.browses }}</span>
                  </el-form-item>
                  <el-form-item label="点赞数量">
                    <span>{{ props.row.likes }}</span>
                  </el-form-item>
                  <el-form-item label="评论数量">
                    <span>{{ props.row.comments }}</span>
                  </el-form-item>
                  <el-form-item label="文章分类">
                    <span>{{ props.row.category }}</span>
                  </el-form-item>
                  <el-form-item label="发布时间">
                    <span v-if="props.row.publishDatetime">{{ props.row.publishDatetime }}</span>
                    <span v-else>未发布</span>
                  </el-form-item>
                  <el-form-item label="最近修改">
                    <span>{{ props.row.lastEdit }}</span>
                  </el-form-item>
                  <el-form-item label="文章来源">
                    <el-link v-if="props.row.origin" type="success" :href="props.row.origin" :underline="false" target="_blank">转载</el-link>
                    <el-link v-else type="primary" :href="`https://zh-ti.top/tblog/${props.row.id}`" :underline="false" target="_blank">原创</el-link>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>

            <el-table-column
            prop="title"
            label="标题"
            fixed="left"
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
            prop="category"
            label="分类"
            width="180"
            sortable
            :filters="docCategoryFilters"
            :filter-method="docCategoryFilter"
            >
            </el-table-column>

            <el-table-column
            prop="publishDatetime"
            label="发布时间"
            width="180"
            sortable
            :filters="dateFilters"
            :filter-method="publishDateFilter"
            >
                <template slot-scope="scope">
                  <span v-if="scope.row.state === 1">{{scope.row.publishDatetime}}</span>
                  <span v-else-if="scope.row.state === 0 && scope.row.publishDatetime">已撤回</span>
                  <span v-else>未发布</span>
                </template>
            </el-table-column>

            <el-table-column
            label="操作"
            width="150"
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
                    v-else
                    size="mini"
                    @click="deleteDoc(scope.row)"
                    type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
  </div>
</template>

<script>

  import documentReq from 'network/document/document'

  export default {
    data() {
      return {
        tableData: [],
        dateFilters: [],
        docCategoryFilters: []
      }
    },
    mounted(){
      this.refreshData()
    },
    beforeRouteLeave(to, from, next){
      this.$store.commit('changeLoadState', true)
      next()
    },
    methods: {
      refreshData(){
        documentReq.getDocumentList()
        .then(result=>{
          this.tableData = result
          const map = new Map()
          const set = new Set()
          for(let item of result) {
            map.set(item.category, item.categoryId)
            if(!item.publishDatetime) set.add("未发布")
            else set.add(item.publishDatetime.trim().substr(0, 10))
          }
          this.dateFilters = [...set].map(item => new Object({text: item, value: item}))
          this.docCategoryFilters = [...map].map(item => new Object({text: item[0], value: item[1]}))
          this.$store.dispatch("changeLoadState", false)
        })
      },
      clearFilter(event) {
        this.$refs.documents.clearFilter()
        event.target.blur()
      },
      docCategoryFilter(value, row){
          return value === row.categoryId
      },
      publishDateFilter(value, row) {
         // 当 publishDatatime 不存在且 value=未发布
         // 说明筛选的是未发布的文章，当前的也是未发布的文章，返回 true
        if(!row.publishDatetime && value === "未发布") return true
        // 当 publishDatetime 不存在且因上一个 if 不成立已经得出 value!=未发布，
        // 说明筛选的是已发布的文章，但当前的是未发布的文章，返回 false
        else if(!row.publishDatetime) return false
        // 当 publishDateime 存在，则判断当前的 publishDateime是否包含 value
        return row.publishDatetime.indexOf(value) != -1
      },
      addDoc(){
        this.$router.push('/manage/docEdit')
      },
      editDoc(payload){
        this.$router.push(`/manage/docEdit/${payload.id}`)
      },
      withdrawDoc(payload){
          this.$confirm(`确定要撤回文章 “${payload.title}” 吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              documentReq.withdrawDocument(payload.id)
              .then(result=>{
                if(result > 0){
                  this.$message({
                    type: 'success',
                    message: '撤回成功!'
                  });
                  this.refreshData()
                }
              })
            }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消撤销文章'
              });          
            });
      },
      deleteDoc(payload){
          this.$confirm(`确定要删除文章 “${payload.title}” 吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              documentReq.deleteDocument(payload.id).then(result=>{
                if(result > 0){
                  this.$message({
                      type: 'success',
                      message: '删除成功!'
                  });
                  this.refreshData();
                }
              })
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

<style>
  
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #6581a7;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .original{
    color: #0984e3;
  }
</style>