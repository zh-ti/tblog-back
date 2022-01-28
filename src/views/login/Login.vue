<template>
  <div id="login">
    <form class="login-form">
      <h2>登录后台</h2>
      <div>
        <input 
        type="text" 
        placeholder="账户" 
        name="account" 
        v-model.trim="form.account" 
        focus="true"
        autocomplete="off">
      </div>
      <div>
        <input 
        type="password" 
        placeholder="密码" 
        name="password" 
        v-model.trim="form.password" 
        autocomplete="off">
      </div>
      <button @click.prevent="check">登录</button>
    </form>
    
    <transition name="el-fade-in">
        <div v-show="showDialog" class="transition-box">
          <verify-dialog
            title="请完成验证"
            :showDialog.sync="showDialog"
          >
              <slide-verify
              :imgs="verifyImgs"
              slot="content"
              :width="380"
              :height="200"
              @success="onSuccess"
              @fail="onFail"
              ref="verify"
              style="margin-bottom:10px"
              ></slide-verify>  
          </verify-dialog>
        </div>
    </transition>
      
    
  </div>
</template>

<script>

    import img1 from 'assets/img/slide-verify/verify1.jpg'
    import img2 from 'assets/img/slide-verify/verify2.jpg'
    import img3 from 'assets/img/slide-verify/verify3.jpg'
    import img4 from 'assets/img/slide-verify/verify4.jpg'
    import img5 from 'assets/img/slide-verify/verify5.jpg'
    import SlideVerify from "components/common/SlideVerify"

    import VerifyDialog from "components/common/Dialog"

    import managerReq from 'network/manager'
    import Cookie from 'lib/cookie/cookie'

  export default {
    data(){
      return {
        showDialog: false,
        form: {
          account: '',
          password: ''
        },
        verifyImgs: [
          img1,
          img2,
          img3,
          img4,
          img5
        ],
      }
    },
    methods: {
      onSuccess(time){
        this.$message({
          type: "success",
          message: `验证成功，用时 ${time/1000} 秒`
        })
        this.login()
      },
      onFail(){
        this.$message({
          type: "error",
          message: `验证失败，请重新验证`
        })
      },
      check(){
        if(this.form.account.length <= 0){
          this.$message({
            type: "error",
            message: "账户不能为空"
          })
          return
        }
        if(this.form.password.length <= 0){
          this.$message({
            type: "error",
            message: "密码不能为空"
          })
          return
        }
        this.showDialog = true
      },
      login(){
        this.showDialog = false
        managerReq.login(this.form)
        .then(result=>{
          console.log(result);
          if(result !== null){
            this.$message({
              type: "success",
              message: "登录成功"
            })
            Cookie.set("account", result.cookie, new Date().getTime()+3600)
            this.$router.push("/manage")
          }else{
            this.$message({
              type: "error",
              message: "账号或密码错误，请重试"
            })
            this.$refs.verify.refresh();
          }
        }).catch(reason=>{
          console.log(reason);
        })
      }
    },
    components: {
      SlideVerify,
      VerifyDialog,
    },
  }
</script>

<style>
  #login{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("~assets/img/login/login-bg.jpg");
    background-size: cover;
  }
  #login .login-form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    padding: 70px 30px;
    background-color: rgba(255,255,255,0.5);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    transition:0.5s;
  }
  #login .login-form:hover{
    box-shadow: 0 0 10px #cecece;
  }
  #login h2{
    margin-bottom: 20px;
    letter-spacing: 3px;
    font-size: 22px;
    color: #555;
  }
  #login input{
    margin: 10px 0;
    height: 30px;
    border: none;
    outline: none;
    padding: 20px 15px;
    background-color: transparent;
    border: 1px solid #666;
    border-radius: 20px;
    color: #666;
  }
  #login button{
    padding: 10px 20px;
    height: 35px;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 18px;
    margin-top: 10px;
    background-color: #74b9ff;
    color: #fff;
    letter-spacing: 5px;
    transition: 0.3s;
  }
  #login button:hover{
    background-color: #0984e3;

  }
  .input-error{
    border-color: #ff6b6b;
  }
</style>
