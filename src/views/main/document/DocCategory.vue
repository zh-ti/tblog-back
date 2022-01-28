<template>
    <div>
        <el-table
            :data="docCategoryList"
            height="75vh"
            style="width: 100%;"
        >

            <el-table-column
            fixed="left"
            prop="name"
            sortable
            min-width="100px"
            label="分类名">
            </el-table-column>

            <el-table-column
            prop="docAmount"
            sortable
            width="100"
            label="文章数">
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
            prop="createDatetime"
            sortable
            min-width="180"
            label="创建时间">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.createDatetime }}</span>
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
                    @click="updateDocCategory(scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="deleteDocCategory(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="btn-row">
            <el-button type="primary" @click="addDocCategory">添加分类</el-button>
        </el-row>
    </div>
</template>

<script>
    import categoryReq from 'network/document/docCategory'

export default {
    data(){
        return {
           docCategoryList: [],
           search: '',
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
            categoryReq.getDocCategoryList().then(result=>{
                this.docCategoryList = result
                this.$store.dispatch("changeLoadState", false)
            })
        },
        addDocCategory() {
            this.$prompt('请输入新的分类名', '请输入', {
            confirmButtonText: '添加',
            cancelButtonText: '取消',
            inputPattern: /^[A-Za-z].{0,15}$/,
            inputErrorMessage: '格式错误，只能以字母开头，且长度不超过16位。'
            }).then(({ value }) => {
                categoryReq.addDocCategory(value).then(result=>{
                    if(result > 0){
                        this.refreshData()
                        this.$message({
                            type: 'success',
                            message: `新分类 ${value} 添加成功`
                        });
                    }else if(result === -1){
                        this.$message({
                            type: "error",
                            message: `分类 ${value} 已存在`
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消添加分类'
                });       
            });
        },
        updateDocCategory(payload){
            this.$prompt(`请输入 ${payload.name} 修改后的分类名`, '请输入', {
            confirmButtonText: '修改',
            cancelButtonText: '取消',
            inputPattern: /^[A-Za-z].{0,31}$/,
            inputErrorMessage: '格式错误，只能以字母开头，且长度不超过32位。'
            }).then(({ value }) => {
                categoryReq.updateDocCategory(payload.id, value)
                .then(result=>{
                    if(result > 0){
                        this.refreshData()
                        this.$message({
                            type: 'success',
                            message: `分类 ${payload.name} 修改为 ${value}`
                        });
                    }else if(result === -1){
                        this.$message({
                            type: "error",
                            message: `分类 ${value} 已存在`
                        })
                    }
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消编辑分类'
                });       
            });
        },
        deleteDocCategory(payload){
            this.$confirm(`确定要删除分类 ${payload.name} ?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                categoryReq.deleteDocCategory(payload.id)
                .then(result=>{
                    if(result > 0){
                        this.refreshData();
                        this.$message({
                            type: 'success',
                            message: `分类 ${payload.name} 删除成功!`
                        });
                    }else if(result === -1){
                        this.$message({
                            type: "error",
                            message: `请先删除分类 ${payload.name} 下的所有文章`
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除分类'
                });          
            });
        }
    }
}
</script>

<style scoped>
    .btn-row{
        display: flex;
        justify-content: center;
        padding: 10px;
    }
</style>
