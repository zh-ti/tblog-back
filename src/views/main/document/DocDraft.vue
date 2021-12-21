<template>
    <div id="doc-draft">
        <el-card class="box-card clearfix" header="文章名称" shadow="hover" width="300">
            <div class="content">
              文章内容...，通过将alt属性设置为有意义的描述，用来访问 HTML 图像，这对于屏幕阅读器用户非常有帮助。
然而，如果一个alt描述是不需要的，请不要删除它，如果你这样做，图像src将被读出,这对可访问性非常不利。
不仅如此，如果图像因为某种原因没有加载，并且它有一个清晰的alt，它将作为一个回退显示。同样通过图例来演示一下。
            </div>
            <div class="bottom clearfix">
              <div class="publish-state" style="float: left">
                <el-link type="success" href="https://zh-ti.top" target="_blank">已发布</el-link>
              </div>
              <div class="btn"  style="float: right">
                <el-button size="mini" @click="edit()" type="primary" class="button">编辑</el-button>
                <el-button size="mini" type="danger">删除</el-button>
              </div>
            </div>
        </el-card>
        <el-card class="box-card clearfix" header="文章名称" shadow="hover" width="300">
            <div class="content">
              文章内容...，通过将alt属性设置为有意义的描述，用来访问 HTML 图像，这对于屏幕阅读器用户非常有帮助。
然而，如果一个alt描述是不需要的，请不要删除它，如果你这样做，图像src将被读出,这对可访问性非常不利。
不仅如此，如果图像因为某种原因没有加载，并且它有一个清晰的alt，它将作为一个回退显示。同样通过图例来演示一下。
            </div>
            <div class="bottom clearfix">
              <div class="publish-state" style="float: left">
                <el-link type="danger" disabled>未发布</el-link>
              </div>
              <div class="btn"  style="float: right">
                <el-button size="mini" @click="edit()" type="primary" class="button">编辑</el-button>
                <el-button size="mini" type="danger">删除</el-button>
              </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        methods: {
          edit(){
            this.$router.push('/docEdit/'+2)
          },
          loaded(){
            this.$store.commit('changeLoadState', false)
          }
        },
        beforeRouteLeave(to, from, next){
          this.$store.commit('changeLoadState', true)
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
    width: 400px;
    margin-bottom: 20px;
  }
</style>