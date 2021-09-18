<template>
  <div :class="['app', dark ? 'theme-dark' : '']">
    <Navbar/>
    <div class="router">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  computed: {}
}
</script>

<style lang="scss">
body, html, #app, .app {
  height: 100%;
  overflow: hidden;
}

body {
  margin: 0;
  border-radius: 5px;
}

*, ::before, ::after {
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-flow: column nowrap;

  border-radius: 5px;
  overflow: hidden;

  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}

.app {
  background: #fff;
  color: #444;

  &.theme-dark {
    background: #222;
    color: #ddd;
  }
}

.router {
  flex: 1 0 auto;
  overflow: auto;
}
</style>
