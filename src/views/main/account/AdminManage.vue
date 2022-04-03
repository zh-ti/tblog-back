<template>
  <div id="admin-manage">
    <el-table
      :data="managers"
      style="width: 100%"
      :row-class-name="isCurrent"
      height="70vh"
      >
      <el-table-column
        prop="name"
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
        prop="registrationDatetime"
        sortable
        min-width="180"
        label="注册时间">
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
          :disabled="scope.row.position <= currentManager.position && scope.row.id != currentManager.id"
          >修改</el-button>
          <el-button
          size="mini"
          type="danger"
          v-if="scope.row.id !== currentManager.id"
          @click="deleteManager(scope.row.id, scope.row.name)"
          :disabled="scope.row.position <= currentManager.position"
          >删除</el-button>
          <el-button
          v-if="scope.row.id === currentManager.id"
          size="mini"
          type="danger"
          @click="distroySelf(scope.row.id)"
          >注销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="btn">
      <el-button v-if="currentManager.position <= 1" type="primary" @click="showForm(true, 'add')">添加管理员</el-button>
    </el-row>

    <el-dialog title="管理员信息" :visible.sync="dialogFormVisible">
    <el-form :model="form" ref="addForm" :rules="formRules">
      <el-form-item 
      label="账户名" 
      :label-width="formLabelWidth" 
      prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
       <el-form-item 
      label="密码" 
      :label-width="formLabelWidth" 
      prop="password">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item 
       v-if="this.form.position != 0 && currentManager.position == 0 || this.operate == 'add'"
      label="管理权限"
      :label-width="formLabelWidth"
      prop="forePosition">
        <el-select v-model="form.forePosition" placeholder="请选择权限">
          <el-option label="普通" value="普通"></el-option>
          <el-option label="高级" value="高级" v-if="currentManager.position == 0"></el-option>
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
          id: '',
          name: '',
          password: '',
          position: '',
          forePosition: '',
        },
        formRules: {
          name: [
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
        formLabelWidth: "100px",
        operate: "add",
        currentManager: ''
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
        this.managers = result.data[0]
        this.$store.dispatch("changeLoadState", false)
      })
      let sessionId = Cookie.get("manager");
      managerReq.getManagerInfo(sessionId).then(result=>{
        this.currentManager = result.data;
      })
      return sessionId
    },
    isCurrent(payload){
      let currentManagerId = this.currentManager.id
      return (currentManagerId == payload.row.id) ? "currentManager" : ''
    },
    handlePassword({row}){
      if(this.currentManager.position < row.position || this.currentManager.id == row.id) return row.password
      return [...row.password].map(()=>"*").join("")
    },
    showForm(judge, operate){
      this.dialogFormVisible = judge
      this.operate = operate
      if(!judge) this.initForm()
    },
    initForm(){
      this.$refs.addForm.resetFields()
      this.operate = 'add'
      this.form = {
        id: '',
        name: '',
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
        if(this.currentManager.position == 0) {
          this.$message({type:"error",message:"当前账号无法注销"})
          return
        }
        managerReq.deleteManager(id).then(({resultStatus})=>{
          if(!resultStatus.hasError){
              this.$message({
                type: "success",
                message: "注销成功"
              })
              Cookie.remove('name')
              this.$router.push("/login").catch(()=>{})
            }
        })
      }).catch(()=>{})
    },
    updateManager(id){
      this.showForm(true, 'update');
      managerReq.getManager(id).then(result=>{
        let formData = result.data[0]
        if(!result.resultStatus.hasError){
          this.form.id = formData.id
          this.form.name = formData.name
          this.form.position = formData.position
          if(formData.position == 1) this.form.forePosition = "高级"
          else if(formData.position == 2) this.form.forePosition = "普通"
        }else{
          this.$message({
            type: "error",
            message: result.resultStatus.reason
          })
        }
      })
    },
    deleteManager(id, name){
      this.$confirm(`确定要删除管理员 ${name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        managerReq.deleteManager(id).then(({resultStatus})=>{
          if(!resultStatus.hasErrpr){
            this.$message({
              type: "success",
              message: "删除成功"
            })
            this.refreshData()
          }else{
            this.$message({
              type: "error",
              message: resultStatus.reaosn
            })
          }
        })
      }).catch(()=>{})
    },
    submit(){
      if(this.form.id.length) this.update()
      else this.add()
    },
    update(){
      managerReq.updateManager(this.form).then(({resultStatus})=>{
        if(!resultStatus.hasError){
          if(this.form.id == this.currentManager.id){
            this.$message({
              type: "success",
              message:"修改成功，请重写登录"
            })
            Cookie.remove('manager')
            setTimeout(()=> 
              this.$router.push({ path: "/login", query: "请重新登录" })
            .catch(()=>{}), 3000)
          }else{
            this.$message({
              type: "success",
              message:"修改成功"
            })
            this.refreshData()
          }
          this.showForm(false)
        }else{
          this.$message({
            type: "error",
            message: resultStatus.reason
          })
        }
      })
    },
    add(){
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if(this.form.forePosition == "普通") this.form.position = 2
          else if(this.form.forePosition == "高级") this.form.position = 1
          managerReq.registerManager(this.form).then(result=>{
            if(!result.resultStatus.hasError){
              this.$message({
                type: "success",
                message: "添加成功"
              })
              this.$refs.addForm.resetFields()
              this.refreshData()
              this.showForm(false)
            }else {
              this.$message({
                type: "error",
                message: result.resultStatus.reason
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

<style scoped>
  .el-table .currentManager{
    background-color: #cae3fc;
    color: #333;
  }
  .btn{
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
</style>
