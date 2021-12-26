<template ref="dialog">
  <div id="dialog">
    <div class="main">
        <div class="header">
            <div class="title"><slot name="title">{{title}}</slot></div>
        </div>
        <div class="body">
            <slot name="content"></slot>
        </div>
        <div class="footer">
            <slot name="bottom"></slot>
        </div>
    </div>
    <div class="mask"  @click.self="close"></div>
  </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default(){
                return "提示"
            }
        },
        showDialog: {
            type: Boolean,
            default(){
                return false
            }
        }
    },
    methods: {
        close(){
            this.$emit("update:showDialog", false)
        },
    },
    watch: {
        showDialog: {
            immediate: true,
            handler(newVal){
                if(newVal){
                    document.body.classList.add('showDialog')
                }else{
                    document.body.classList.remove("showDialog")
                }
            }
        }
    }
}
</script>

<style>
    body.showDialog {
        overflow: hidden;
    }
    body.showDialog #dialog{
        display: flex;
    }
    #dialog{
        display: none;
        position: absolute;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        justify-content: center;
        align-items: center;
    }
    .mask{
        position: absolute;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        background-color: rgba(0,0,0,0.6);
        backdrop-filter: blur(5px);
    }
    #dialog .title{
        text-align: center;
        font-size: 20px;
        margin-bottom: 10px;
        letter-spacing: 5px;
        font-weight: bold;
        color: #666;
    }
    #dialog .main{
        position: absolute;
        z-index: 10;
        background-color: #eee;
        padding: 30px;
        border-radius: 7px;
    }
</style>