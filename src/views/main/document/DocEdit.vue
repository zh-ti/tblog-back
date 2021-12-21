<template>
  <div id="docEdit">
      <md-editor ref="editor" class="md-editor" @editing="docEdit" :content="docContent" :actions="editorActions">
           <button
            type="button"
            @click="dialogFormVisible = true"
            class="op-icon fa el-icon-s-promotion"
            aria-hidden="true"
            slot="left-toolbar-after"
            title="发布"
            ></button>
      </md-editor>

    <el-dialog title="发布文章" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
                <el-input v-model="form.title" autocomplete="off" placeholder="请输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category" :label-width="formLabelWidth">
                <el-select v-model="form.category" placeholder="请选择文章的分类">
                    <el-option label="JavaScript" value="js"></el-option>
                    <el-option label="Java" value="java"></el-option>
                    <el-option label="StringBoot" value="string-boot"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转载" :label-width="formLabelWidth">
                <el-switch v-model="form.isReprint"></el-switch>
            </el-form-item>
            <el-form-item label="原文" :label-width="formLabelWidth">
                <el-input v-model="form.reprint" :disabled="!form.isReprint" autocomplete="off" placeholder="原文地址"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="publish('form')">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import MDEditor from 'components/common/MDEditor'

export default {
    data(){
        return {
            docContent: "",
            editorActions: {
                save(){
                    console.log('saved')
                    return true
                },
                autoSave: 5000
            },
            form: {
                title: '',
                category: '',
                isReprint: false,
                originalUrl: '',
            },
            formLabelWidth: '120px',
            dialogFormVisible: false,
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
                ],
                category: [
                    { required: true, message: '请选择文章的分类', trigger: 'change' }
                ],
            }
        }
    },
    beforeRouteLeave(to, from, next){
      this.$store.commit('changeLoadState', true)
      let result = this.editorActions.save()
      if(result){
        this.$message({
            message: '已自动保存',
            type: 'success'
        });
      }
      next()
    },
    created(){
        console.log(this.$route.params.docId);
    },
    methods: {
        publish(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    console.log('publish')
                    this.dialogFormVisible = false
                }
            });
        },
        docEdit(value){
            this.docContent = value;
        },
    },
    components: {
        MdEditor: MDEditor
    },
}
</script>

<style>
    .md-editor{
        border-radius: 7px;
        box-shadow: 0 0 3px #cecece;
    }
</style>