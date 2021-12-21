<template>
    <div>
        <el-table
            :data="docCategory"
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
            prop="documents"
            sortable
            width="100px"
            label="文章数">
            </el-table-column>

            <el-table-column
            prop="browses"
            sortable
            width="100px"
            label="浏览数">
            </el-table-column>

            <el-table-column
            prop="likes"
            sortable
            width="100px"
            label="点赞数">
            </el-table-column>

            <el-table-column
            prop="comments"
            sortable
            width="100px"
            label="评论数">
            </el-table-column>

            <el-table-column
            prop="createTime"
            sortable
            min-width="180px"
            label="创建时间">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="操作"
            width="150px"
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
export default {
    data(){
        return {
           docCategory: this.$store.state.docCategory,
           search: '',
        }
    },

    methods: {
        
        addDocCategory() {
            this.$prompt('请输入新的分类名', '请输入', {
            confirmButtonText: '添加',
            cancelButtonText: '取消',
            inputPattern: /^[A-Za-z].{0,31}$/,
            inputErrorMessage: '格式错误，只能以字母开头，且长度不超过32位。'
            }).then(({ value }) => {
                this.docCategory.push({name: value})
                this.$message({
                    type: 'success',
                    message: `新分类 ${value} 添加成功`
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消添加分类'
                });       
            });
        },
        updateDocCategory(payload){
            this.$prompt(`请输入 ${payload.name} 修改后的分类名`, '请输入', {
            confirmButtonText: '添加',
            cancelButtonText: '取消',
            inputPattern: /^[A-Za-z].{0,31}$/,
            inputErrorMessage: '格式错误，只能以字母开头，且长度不超过32位。'
            }).then(({ value }) => {
                for(let item of this.docCategory){
                    if(item.name == payload.name){
                        item.name = value;
                        break
                    }
                }
                this.$message({
                    type: 'success',
                    message: `分类 ${payload.name} 修改为 ${value}`
                });
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
                this.docCategory.forEach((item, index, categorys)=>{
                    if(item.name == payload.name){
                        categorys.splice(index, 1)
                    }
                })
                this.$message({
                    type: 'success',
                    message: `分类 ${payload.name} 删除成功!`
                });
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

<style>
    .btn-row{
        display: flex;
        justify-content: center;
        padding: 10px;
    }
</style>