<template>
  <div id="md-editor">
    <mavon-editor  
      ref=md
      v-model="value"
      :ishljs="interStyle.ishljs"  
      :codeStyle="interStyle.codeStyle" 
      :boxShadowStyle="interStyle.boxShadowStyle" 
      :boxShadow="interStyle.boxShadow" 
      :shortCut="interStyle.shortCut"
      :placeholder="interStyle.placeholder"
      :toolbarsFlag="interStyle.toolbarsFlag"
      :editable="interStyle.editable" 
      :navigation="interStyle.navigation"
      :tabSize="2"
      :scrollStyle="true"
      @change="changeDoc"
      @save="actions.save && actions.save(value)"
      @fullScreen="actions.fullScreen && actions.fullScreen()"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
    >
    <template slot="left-toolbar-before">
      <slot name="left-toolbar-before"></slot>
    </template>
    <template slot="left-toolbar-after">
      <slot name="left-toolbar-after"></slot>
    </template>
    <template slot="right-toolbar-before">
      <slot name="right-toolbar-before"></slot>
    </template>
    <template slot="right-toolbar-after">
      <slot name="right-toolbar-after"></slot>
    </template>
    </mavon-editor>
  </div>
</template>

<script>
import {mavonEditor} from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

export default {
    name: 'md-editor',
    components: {
      'mavon-editor': mavonEditor,
    },
    props: {
      content: {
        default(){
          return null
        }
      },
      actions: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    mounted(){
      
    },
    data(){
      return {
        value: this.content,
        autoSaveTimer: null,
        interStyle: {
          width: "",
          codeStyle: 'github',
          boxShadow: false,
          boxShadowStyle:'0 0 5px rgba(0,0,0,0.3)',
          tabSize: 2,
          shortCut: true,
          ishljs: true,
          placeholder: '开始编辑...',
          toolbarsFlag: true,
          editable: true,
          navigation: false,
        },
      }
    },
    methods: {
      changeDoc(){
        this.$emit('editing', this.value)
        this.autoSave(this.actions.autoSave)
      },
      autoSave(time){
        if(this.autoSaveTimer == null && this.actions.autoSave){
          this.autoSaveTimer = setInterval(()=>{
            this.actions.save(this.value)
          }, this.actions.autoSave)
          setTimeout(()=>{
            clearInterval(this.autoSaveTimer)
            this.autoSaveTimer = null
          }, time)
        }
      },
      init(){
        this.value = "";
      },
      imgAdd(pos, img){
        this.$emit('imgAdd', {pos, img, md: this.$refs.md})
      },
      imgDel(arr){
        this.$emit('imgDel', {url: arr[0], img: arr[1]})
      }
    }
}
</script>
<style>
  .hljs{
    padding: 5px 10px !important;
    background-color: #eee !important;
  }
  
  .v-note-panel{
    max-height: 600px;
  }
</style>
