<template>
  <div id="app">
    <main-view />
  </div>
</template>

<script>
import MainView from 'views/main-view/MainView'

export default {
  name: 'App',
  components: {
    MainView
  }
}
</script>

<style>
  @import "~assets/css/base.css";
</style>
