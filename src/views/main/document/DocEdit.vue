<template>
  <div id="docEdit">
      <el-form 
      :inline="true"
      :model="form" 
      ref="form" 
      :rules="rules" 
      :label-position="'left'"
      v-if="showForm"
      :hide-required-asterisk="true"
      >
          <el-row>
            <el-form-item label="文章标题" prop="title" >
              <el-input v-model="form.title" autocomplete="off" placeholder="请输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="categoryId" >
                <el-select v-model="form.categoryId" placeholder="请选择文章的分类">
                    <el-option 
                    v-for="item in docCategoryList" 
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="文章简介" prop="brief">
              <el-input
                type="textarea"
                placeholder="文章简介"
                :autosize="{ minRows: 3, maxRows: 5}"
                v-model="form.brief"
                maxlength="255"
                resize="none"
                show-word-limit
                >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="文章封面">
              <el-upload
                class="avatar-uploader"
                :action="`${$store.state.uploadImageUrl}/1/${this.form.id}`"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadCover"
                >
                <img v-if="form.cover" :src="this.form.cover" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="转载" >
              <el-switch v-model="form.isReprint"></el-switch>
            </el-form-item>
            <el-form-item label="原文" v-if="form.isReprint"  prop="origin">
                <el-input v-model="form.origin" :disabled="!form.isReprint" autocomplete="off" placeholder="原文地址"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button type="primary" size="small" plain v-if="form.state === 0" @click="publish">发布文章</el-button>
              <el-button type="success" size="small" plain v-if="form.state !== 0" @click="publish">更新发布</el-button>
              <el-button type="warning" size="small" plain v-if="form.state !== 0" @click="withdrawDoc">撤回发布</el-button>
            </el-form-item>
          </el-row>
      </el-form>
      <md-editor 
      ref="editor" 
      class="md-editor" 
      :content="form.content" 
      :actions="editorActions"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
      >
      </md-editor>
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
                brief: '',
                content: '',
                state: 0,
                cover: '',
                publishDatetime: '',
            },
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
                ],
                categoryId: [
                  { required: true, message: '请选择文章分类', trigger: 'blur'}
                ],
                brief: [
                  { required: true,  message: '请输入文章简介' },
                  { min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur'}
                ],
                origin: [
                  { required: true, message: '请输入原文链接', trigger: 'blur' }
                ],
            },
            sentTimer: null,
            showForm: true,
            uploadDisable: false,
        }
    },
    mounted(){
      this.loadData();
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
        // 保存图片
        imgAdd({pos, img, md}){
          // 第一步.将图片上传到服务器.
           var formdata = new FormData();
           formdata.append('image', img);
           documentReq.uploadImage(formdata, 0, this.form.id).then(( result) => {
             md.$img2Url(pos, result);
           }, error =>{
             console.log(error);
             console.log(this.$refs.editor.$img2Url);
           })
        },
        uploadCover({file}){
          var formdata = new FormData()
          formdata.append('image', file)
          documentReq.uploadImage(formdata, 1, this.form.id).then( result =>{
            if(result.length > 0 && result !== "fail"){
              this.handleAvatarSuccess(result)
            }else{
              this.$message({
                type: "error",
                message: "上传失败请稍后重试"
              })
            }
          })
        },
        handleAvatarSuccess(url) {
          this.form.cover = url
          this.loadData()
        },
        beforeAvatarUpload(file){
          file
          return true
        },
        imgDel({url}){
          documentReq.deleteImage(url)
        },
        validate(fun){
          if(!this.$refs.form) return
          this.$refs.form.validate((valid) => {
            if(valid){
              fun();
            }
          })
        },
        save(value, message){
          this.validate(()=>{
            this.form.content = value
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
                              message: `文章标题 ${this.form.title} 已存在，请修改标题`
                          })
                      }
                  })
              }
          })
        },
        loadData(){
            this.showForm = false
            this.$store.commit('changeLoadState', true)
            Promise.all([
                new Promise(resolve=>{
                    if(this.$route.params.docId){
                        documentReq.getDocument(this.$route.params.docId)
                        .then(result=>{
                            this.form.id = result.id
                            this.form.categoryId = result.categoryId
                            this.form.title = result.title
                            this.form.isReprint = result.origin.length > 0
                            this.form.content = result.content
                            this.form.brief = result.brief
                            this.form.origin = result.origin
                            this.form.state = result.state
                            this.form.publishDatetime = result.publishDatetime
                            this.form.cover = result.cover
                            this.$refs.editor.value = this.form.content
                            resolve()
                        })
                    }else{
                        resolve()
                    }
                }),
                new Promise( resolve=>{
                    // 获取文章分类
                    docCategoryReq.getDocCategoryList()
                    .then(result => {
                        this.docCategoryList = result
                        resolve()
                    })
                })
            ]).then(()=>{
              this.$store.dispatch("changeLoadState", false)
              
              this.$nextTick(() => {
                this.showForm = true
                this.$store.commit('changeLoadState', false)
              })
            }).catch(()=>{
              this.init(false)
            })
        },
        publish(){
          this.validate(()=>{
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
                        this.loadData()
                      }
                  })
              }).catch(()=>{
                  this.$message({
                      type: 'info',
                      message: '已取消文章发布'
                  });  
              })
            }
          })
        },
        withdrawDoc(){
          this.$confirm(`确定要撤回文章 “${this.form.title}” 吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              documentReq.withdrawDocument(this.form.id)
              .then(result=>{
                if(result > 0){
                  this.$message({
                    type: 'success',
                    message: '撤回成功!'
                  });
                  this.loadData()
                  this.reloadButton()
                }
              })
            }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消撤销文章'
              });          
            });
        },  
        init(loadData = true){
          this.form = {
              id: "",
              title: '',
              categoryId: '',
              isReprint: false,
              origin: '',
              content: '',
          }
          this.showForm = true
          this.$refs.editor.init()
          this.$refs.form.resetFields()
          loadData && this.loadData()
        },
    },
    watch: {
      "$route" (){
        this.init()
        this.$forceUpdate
      }
    },
    components: {
        MdEditor: MDEditor
    },
}
</script>

<style>
    h2{
        margin-bottom: 15px;
        font-weight: 500;
        font-size: 18px;
    }
    #docEdit{
      position: relative;
    }
    .md-editor{
        border-radius: 7px;
        box-shadow: 0 0 3px #cecece;
    }
    .el-input__count{
      line-height: 15px;
    }
    .el-textarea{
      width: 480px;
    }

     .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 260px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      min-width: 130px;
      max-width: 260px;
      min-height: 130px;
      display: block;
      object-fit: cover;
    }
</style>
