<template>
  <div id="admin-manage">
    <el-table
      :data="managers"
      style="width: 100%"
      :row-class-name="isCurrent"
      height="70vh"
      >
      <el-table-column
        prop="account"
        label="账户名"
        sortable
        fixed="left"
        width="180">
      </el-table-column>
      <el-table-column
        prop="position"
        label="权限"
        sortable
        width="180"
        :filters="[
        {text: 'MAX', value: '0'}, 
        {text: '高级', value: '1'}, 
        {text: '普通', value: '2'}]"
        :filter-method="positionFilter"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.position == 0">MAX</span>
          <span v-else-if="scope.row.position == 1">高级</span>
          <span v-else>普通</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="registDatetime"
        sortable
        min-width="180"
        label="注册时间">
      </el-table-column>
      <el-table-column
      prop="password"
      label="密码"
      width="180"
      >
        <template slot-scope="scope">
          {{handlePassword(scope)}}
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
          @click="updateManager(scope.row.id)"
          :disabled="scope.row.position <= current.position && scope.row.id != current.id"
          >修改</el-button>
          <el-button
          size="mini"
          type="danger"
          v-if="scope.row.id !== current.id"
          @click="deleteManager(scope.row.id, scope.row.account)"
          :disabled="scope.row.position <= current.position"
          >删除</el-button>
          <el-button
          v-if="scope.row.id === current.id"
          size="mini"
          type="danger"
          @click="distroySelf(scope.row.id)"
          >注销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="btn">
      <el-button v-if="current.position <= 1" type="primary" @click="showForm(true)">添加管理员</el-button>
    </el-row>

    <el-dialog title="管理员信息" :visible.sync="dialogFormVisible">
    <el-form :model="form" ref="addForm" :rules="formRules">
      <el-form-item 
      label="账户名" 
      :label-width="formLabelWidth" 
      prop="account">
        <el-input v-model="form.account" autocomplete="off"></el-input>
      </el-form-item>

       <el-form-item 
       label="密码" 
       :label-width="formLabelWidth" 
       prop="password">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item 
      label="管理权限" 
      :label-width="formLabelWidth" 
      prop="forePosition">
        <el-select v-model="form.forePosition" placeholder="请选择权限">
          <el-option label="普通" value="普通"></el-option>
          <el-option label="高级" value="高级" v-if="current.position == 0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showForm(false)">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>

import managerReq from 'network/manager'
import Cookie from 'lib/cookie/cookie'

export default {
  data(){
    return {
      managers: [],
      dialogFormVisible: false,
      form: {
        account: '',
        password: '',
        position: '',
        forePosition: '',
      },
      formRules: {
        account: [
          {required: true, message: "请输入账户名", trigger: 'change'},
          {min: 1, max: 16, message: "长度在 3 到 16 个字符", trigger: "change"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 255, message: "长度在 6 到 255 个字符", trigger: 'blur'}
        ],
        forePosition: [
          {required: true, message: "请选择管理员权限", trggler: 'change'},
        ]
      },
      formLabelWidth: "100px"
    }
  },
  computed: {
    current(){
      return JSON.parse(Cookie.get("account"))
    }
  },
  beforeRouteLeave(to, from, next){
    this.$store.dispatch("changeLoadState", true)
    next()
  },
  mounted(){
    this.refreshData()
  },
  methods: {
    refreshData(){
      managerReq.getManagerList()
      .then(result=>{
        this.managers = result
        this.$store.dispatch("changeLoadState", false)
      })
    },
    isCurrent(payload){
      let currentId = this.current.id
      return (currentId == payload.row.id) ? "current" : ''
    },
    handlePassword({row}){
      if(this.current.position < row.position || this.current.id == row.id) return row.password
      return [...row.password].map(()=>"*").join("")
    },
    showForm(judge){
      this.dialogFormVisible = judge
      if(!judge) this.initForm()
    },
    initForm(){
      this.$refs.addForm.resetFields();
      this.form = {
        account: '',
        password: '',
        position: '',
        forePosition: '',
      }
    },
    positionFilter(value, row){
      return value == row.position
    },
    distroySelf(id){
      this.$confirm(`确定要注销自己的账号吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        if(this.current.position == 0) {
          this.$message({type:"error",message:"当前账号无法注销"})
          return
        }
        this.$prompt('请输入密码以确认身份', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\w]{6,255}$/,
          inputErrorMessage: '密码格式输入错误'
        }).then(({ value }) => {
            managerReq.verifyPassword(id, value)
            .then(result=>{
              if(result){
                managerReq.deleteManager(id).then(result=>{
                  if(result > 0){
                      this.$message({
                        type: "success",
                        message: "注销成功"
                      })
                      Cookie.remove('account')
                      this.$router.push("/manage/login").catch(()=>{})
                    }
                  })
              }else{
                this.$message({
                  type: "error",
                  message: "密码输入错误"
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
        
      }).catch(()=>{})
    },
    updateManager(id){
      this.showForm(true);
      managerReq.getManager(id).then(result=>{
        if(result){
          this.form = result
          if(result.position == 1) this.form.forePosition = "高级"
          else if(result.position == 2) this.form.forePosition = "普通"
        }
      })
    },
    deleteManager(id, account){
      this.$confirm(`确定要删除管理员 ${account} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        managerReq.deleteManager(id).then(result=>{
          if(result > 0){
            this.$message({
              type: "success",
              message: "删除成功"
            })
            this.refreshData()
          }
        })
      }).catch(()=>{})
    },
    submit(){
      if(this.form.id) this.update()
      else this.add()
    },
    update(){
      managerReq.updateManager(this.form).then(result=>{
        if(result > 0){
          if(this.form.id == this.current.id){
            this.$message({
              type: "success",
              message:"修改成功，请重写登录"
            })
            Cookie.remove('account')
            setTimeout(()=> this.$router.push("/login").catch(()=>{}), 3000)
          }else{
            this.$message({
              type: "success",
              message:"修改成功"
            })
          }
          this.showForm(false)
          this.refreshData()
        }else if(result == -1){
          this.$message({
            type: "error",
            message: `账户名 ${this.form.account} 已存在，换一个吧`
          })
        }else{
          this.$message({
            type: "error",
            message: `发生了未知错误请重试`
          })
          this.showForm(false)
        }
      })
    },
    add(){
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if(this.form.forePosition == "普通") this.form.position = 2
          else if(this.form.forePosition == "高级") this.form.position = 1
          managerReq.registerManager(this.form).then(result=>{
            if(result > 0){
              this.$message({
                type: "success",
                message: "添加成功"
              })
              this.$refs.addForm.resetFields()
              this.refreshData()
              this.showForm(false)
            }else if(result == -1){
              this.$message({
                type: "error",
                message: `账户名 ${this.form.account} 已存在，换一个吧`
              })
            }
          })
        } else {
          return false;
        }
      });
    }
  },
  
}
</script>

<style>
  .el-table .current{
    background-color: #cae3fc;
    color: #333;
  }
  .btn{
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
</style>