<template>
  <div id="md-editor">
    <mavon-editor  
      v-model="value"
      :external-link="externalLink" 
      :ishljs="editorStyle.ishljs || interStyle.ishljs"  
      :codeStyle="editorStyle.codeStyle || interStyle.codeStyle" 
      :boxShadowStyle="editorStyle.boxShadowStyle || interStyle.boxShadowStyle" 
      :boxShadow="editorStyle.boxShadow || interStyle.boxShadow" 
      :shortCut="editorStyle.shortCut || interStyle.shortCut"
      :placeholder="editorStyle.placeholder || interStyle.placeholder"
      :toolbarsFlag="editorStyle.toolbarsFlag || interStyle.toolbarsFlag"
      :editable="editorStyle.editable || interStyle.editable" 
      :navigation="editorStyle.navigation || interStyle.navigation"
      @change="changeDoc"
      @save="actions.save && actions.save()"
      @fullScreen="actions.fullScreen && actions.fullScreen()"
      @imgDel="actions.imgDel && actions.imgDel()"
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
      editorStyle: {
        type: Object,
        default(){
          return {}
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
          boxShadow: true,
          boxShadowStyle:'0 0 5px rgba(0,0,0,0.3)',
          tabSize: 2,
          shortCut: true,
          ishljs: true,
          placeholder: '开始编辑...',
          toolbarsFlag: true,
          editable: true,
          navigation: false,
        },
        externalLink: {
          hljs_js: () => '/md/highlightjs/highlight.min.js',
          hljs_css: (css) => '/md/highlightjs/styles/' + css + '.min.css',
          hljs_lang: (lang) => '/md/highlightjs/languages/' + lang + '.min.js',
          katex_css: () => '/md/katex/katex.min.css',
          katex_js: () => '/md/katex/katex.min.js',
          markdown_css: ()=> '/md/markdown/github-markdown.min.css'
        }
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
            this.actions.save()
          }, this.actions.autoSave)
          setTimeout(()=>{
            clearInterval(this.autoSaveTimer)
            this.autoSaveTimer = null
          }, time)
        }
      }
    }
}
</script>
<style scoped>
</style>