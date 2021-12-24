<template>
    <div id="doc-draft">
        <el-card v-for="item in documents" :key="item.id" class="box-card clearfix" :header="item.title" shadow="hover" width="300">
            <div class="content">
              {{item.content.length > 0 ? item.content : "无内容"}}
            </div>
            <div class="bottom clearfix">
              <div class="publish-state">
                <el-link v-if="item.publishDatetime" type="warning" target="_blank" :underline="false">已撤回</el-link>
                <el-link v-else type="danger" :underline="false">未发布</el-link>
              </div>
              <div class="center">
                最近修改：{{item.lastEdit}}
              </div>
              <div class="btn">
                <el-button size="mini" @click="edit(item.id)" type="primary" class="button">编辑</el-button>
                <el-button size="mini" @click="deleteDoc(item.id, item.title)" type="danger">删除</el-button>
              </div>
            </div>
        </el-card>
    </div>
</template>

<script>
  import docDraftReq from 'network/document/docDraft'
  import documentReq from 'network/document/document'

    export default {
        data(){
          return {
            documents: [],
          }
        },
        methods: {
          edit(id){
            this.$router.push('/docEdit/'+id)
          },
          refreshData(){
            docDraftReq.getUnpublishedDocList().then(result=>{
              this.documents = result
              this.$store.dispatch("changeLoadState", false)
            })
          },
          deleteDoc(id, title){
            this.$confirm(`确定要删除文章 “${title}” 吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              documentReq.deleteDocument(id).then(result=>{
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
        },
        mounted(){
          this.refreshData()
        },
        beforeRouteLeave(to, from, next){
          this.$store.dispatch('changeLoadState', true)
          next()
        },
    }
</script>

<style scoped>
  #doc-draft{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    align-items:center;
  }
  .text {
    font-size: 14px;
  }
  .publish-state{
    font-size: 16px;
    line-height: 28px;
  }
   .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    color: #555;
    text-indent: 2em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 430px;
    margin-bottom: 20px;
  }

  .center{
    margin: 0 auto;
    font-size: 14px;
    color: #999;
  }
</style>