<template>
    <div id="doc-draft">
        <el-card v-for="item in documents" :key="item.id" :header="item.title" shadow="hover" width="300">
            <div class="content">
              {{item.brief.length > 0 ? item.brief : "无简介"}}
            </div>
            <div class="bottom">
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
        <el-empty v-if="documents.length <= 0" description="这啥也没有"></el-empty>
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
            this.$router.push('/manage/docEdit/'+id)
          },
          refreshData(){
            docDraftReq.getUnpublishedDocList().then(result=>{
              this.documents = result.data[0]
              this.$store.dispatch("changeLoadState", false)
            })
          },
          deleteDoc(id, title){
            this.$confirm(`确定要删除文章 “${title}” 吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              documentReq.deleteDocument(id).then(({resultStatus})=>{
                if(!resultStatus.hasError){
                  this.$message({
                      type: 'success',
                      message: `文章 “${title}” 删除成功`
                  });
                  this.refreshData();
                }else{
                  this.$message({
                    type: "error",
                    message: resultStatus.reason
                  })
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
    height: 30px;
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

  .el-card {
    width: 430px;
    margin-bottom: 20px;
  }

  .center{
    margin: 0 auto;
    font-size: 14px;
    color: #999;
  }
</style>
