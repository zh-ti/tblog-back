<template>
  <div>
      <slide-verify 
      @success="onSuccess" 
      @again="onAgain" 
      @fulfilled="onFulfilled" 
      @fail="onFail" 
      @refresh="onRefresh" 
      :slider-text="text" 
      :accuracy="accuracy"
      :imgs="imgs"
      :l="50"
      :r="10"
      :w="width"
      :h="height"
      ref="slideblock"
      class="verify"
      ></slide-verify>
  </div>
</template>

<script>
    export default {
        name: 'App',
        data(){
            return {
                text: '滑动验证',
                accuracy: 3,
            }
        },
        props: {
            imgs: {
                type: Array,
                require: true,
            },
            width: {
                type: Number,
                defualt(){
                    return 350
                }
            },
            height: {
                type: Number,
                default(){
                    return 200
                }
            }
        },
        methods: {
            onSuccess(times){
                // console.log('验证通过');
                this.$emit("success", times)
            },
            onFail(){
                this.$emit("fail")
                // console.log('验证不通过');
            },
            onRefresh(){
                this.$emit("refresh")
                // console.log('点击了刷新图标');
            },
            onFulfilled() {
                this.$emit("refreshed")
                // console.log('刷新成功');
            },
            onAgain() {
                // console.log('检测到非人为操作');
                // 刷新
                this.refresh();
            },
            refresh() {
                this.$refs.slideblock.reset();
            },
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
    .verify{
        width: 500px;
        height: 250px;
    }
    .btn {
      margin-top: 20px;
      outline: 0;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      color: #fff;
      background-color: #1890ff;
      cursor: pointer;
    }
    .btn:active {
      box-shadow: 1px 5px 0 rgba(0, 0, 0, 0.1) inset;
    }
</style>
