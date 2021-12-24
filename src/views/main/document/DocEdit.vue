<template>
  <div id="docEdit">
      <h2>正在编辑文章：{{form.title}}</h2>
      <md-editor ref="editor" class="md-editor" :content="form.content" :actions="editorActions">
           <button
            type="button"
            @click="publish()"
            class="op-icon fa el-icon-s-promotion"
            aria-hidden="true"
            slot="left-toolbar-after"
            title="发布"
            ></button>
      </md-editor>

    <el-dialog title="文章信息" width="40%" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
                <el-input v-model="form.title" autocomplete="off" placeholder="请输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="categoryId" :label-width="formLabelWidth">
                <el-select v-model="form.categoryId" placeholder="请选择文章的分类">
                    <el-option 
                    v-for="item in docCategoryList" 
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转载" :label-width="formLabelWidth">
                <el-switch v-model="form.isReprint"></el-switch>
            </el-form-item>
            <el-form-item label="原文" v-if="form.isReprint" :label-width="formLabelWidth" prop="origin">
                <el-input v-model="form.origin" :disabled="!form.isReprint" autocomplete="off" placeholder="原文地址"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showForm(false)">取 消</el-button>
            <el-button type="primary" @click="showForm(false)">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import MDEditor from 'components/common/MDEditor'

import docCategoryReq from "network/document/docCategory"
import documentReq from 'network/document/document'

export default {
    data(){
        return {
            docContent: "",
            editorActions: {
                save: this.save,
                autoSave: 1000*60
            },
            docCategoryList: [],
            form: {
                id: "",
                title: '',
                categoryId: '',
                isReprint: false,
                origin: '',
                content: '',
            },
            formLabelWidth: '120px',
            dialogFormVisible: false,
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '请选择文章的分类', trigger: 'change' }
                ],
                origin: [
                    { required: true, message: '请输入原文链接' }
                ],
            },
            sentTimer: null,
        }
    },
    mounted(){
        new Promise(resolve=>{
            if(this.$route.params.docId){
                documentReq.getDocument(this.$route.params.docId)
                .then(result=>{
                    this.form.id = result.id
                    this.form.categoryId = result.categoryId
                    this.form.title = result.title
                    this.form.isReprint = result.origin.length > 0
                    this.form.content = result.content
                    this.form.origin = result.origin
                    this.$refs.editor.value = this.form.content
                    resolve()
                })
            }
            docCategoryReq.getDocCategoryList()
            .then(result =>{
                this.docCategoryList = result
                resolve()
            })
        }).then(()=>{
            this.$store.dispatch("changeLoadState", false)
            this.showForm(true)
        })
    },
    beforeRouteLeave(to, from, next){
        this.$store.commit('changeLoadState', true)
        if(this.$refs.editor.value.length > 0 && this.hasInfo()){
            this.save(this.$refs.editor.value, "已自动保存")
        }
        next()
    },
    methods: {
        hasInfo(){
            return this.form.title.length > 0 && this.form.categoryId.length > 0
        },
        showForm(judge){
            this.dialogFormVisible = judge
        },
        save(value, message){
            if(!this.$refs.form) return
            this.$refs.form.validate((valid) => {
                this.form.content = value
                if (valid) {
                    this.showForm(!this.hasInfo())
                    if(this.form.id.length > 0){
                        documentReq.updateDocument(this.form)
                        .then(result=>{
                            if(result > 0){
                                if(message){
                                    this.$message({
                                        type: "success",
                                        message: `文章 ${this.form.title} ${message}`
                                    })
                                }else{
                                    this.$message({
                                        type: "success",
                                        message: `文章 ${this.form.title} 更新成功`
                                    })
                                }
                            }
                        })
                    }else{
                        documentReq.addDocument(this.form)
                        .then(result=>{
                            result = JSON.parse(result)
                            if(result.result > 0){
                                this.$message({
                                    type: "success",
                                    message: `文章 ${this.form.title} 添加成功`
                                })
                                this.form.id = result.id
                            }else if(result.result === -1){
                                this.$message({
                                    type: "error",
                                    message: `文章标题 ${this.form.title} 已存在`
                                })
                                setTimeout(()=>this.showForm(true), 1000)
                            }
                        })
                    }
                }else{
                    this.showForm(true)
                }
            });
        },
        publish(){
            if(this.hasInfo()){
                this.$confirm(`确定要发布文章 ${this.form.title} 吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    documentReq.publishDocument(this.form)
                    .then(result=>{
                        if(result > 0){
                            this.$message({
                                type: 'success',
                                message: `文章 ${this.form.title} 发布成功`
                            });
                        }
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '已取消文章发布'
                    });  
                })
            }else{
                this.showForm(true)
            }
        },
    },
    components: {
        MdEditor: MDEditor
    },
}
</script>

<style>
    h2{
        margin-bottom: 15px;
        font-size: 18px;
    }
    .md-editor{
        border-radius: 7px;
        box-shadow: 0 0 3px #cecece;
    }
</style>