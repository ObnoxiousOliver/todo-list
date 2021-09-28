<template>
  <div class="app">
    <Navbar/>
    <div class="router">
      <ScrollView>
          <router-view v-slot="{ Component }">
            <transition name="router" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
      </ScrollView>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import Navbar from './components/Navbar.vue'
import ScrollView from './components/ScrollView.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    ScrollView
  },
  computed: {
    ...mapState(['config']),
    theme () {
      return this.config.theme
    }
  },
  watch: {
    theme () {
      document.body.setAttribute('class', 'theme-' + this.config.theme)
    }
  },
  beforeMount () {
    this.appStart()
  },
  methods: {
    ...mapActions([
      'appStart'
    ])
  }
}
</script>

<style lang="scss">
@use './assets/scss' as r;
@use './assets/scss/context-menu';

body, html, #app, .app {
  height: 100%;
  overflow: hidden;
}

body {
  --bg-mod: #4444;

  margin: 0;
  border-radius: 5px;
  user-select: none;

  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #444;

  &.theme-dark {
    --bg-mod: #aaa4;
    color: #ddd;
  }
}

*, ::before, ::after {
  box-sizing: border-box;
}

#app {
  border-radius: 5px;
  overflow: hidden;

}

:focus {
  outline: none;
}

:focus-visible {
  outline: r.$accent solid 2px;
}

::selection {
  background: r.$accent;
  color: #fff;
}

.app {
  display: flex;
  flex-flow: column nowrap;

  background: r.$bg-light;

  transition: background-color .3s;

  .theme-dark & {
    background: r.$bg-dark;
  }
}

.router {
  flex: 1 0 auto;
  height: 0;

  &-enter-active {
    transition: opacity .1s, transform .4s r.$easing;
  }

  &-leave-active {
    transition: opacity .1s;
  }
  &-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }

  &-leave-to {
    opacity: 0;
  }
}

.input--checkbox {
  appearance: none;
  position: relative;

  width: 20px;
  height: 20px;

  border: r.$bg-mod solid 2px;
  border-radius: 30%;

  cursor: pointer;
  transition: .2s, border .3s .2s, background-color .2s;
  transition-timing-function: r.$easing;

  &:hover {
    background: #8882;
    box-shadow: #0004 0 2px 5px;
  }

  &::after, &::before {
    content: '';

    position: absolute;
    inset: 50% auto auto 50%;

    background: #fff;
    border-radius: 1px;
    width: 2px;
    height: 0;

    transition-timing-function: r.$easing;
  }
  &::before {
    height: 12px;
    transform: translate(-50%, -50%)translate(-1px, 11px)rotate(-135deg)scaleY(0);
    transform-origin: 0 0;
    transition: .2s;
  }
  &::after {
    height: 6px;
    transform: translate(-50%, -50%)translate(-5.5px, 4px)rotate(-45deg)scaleY(0);
    transform-origin: 0 0;
    transition: .2s .1s;
  }

  &:checked {
    border: r.$accent solid 10px;
    background: r.$accent;

    transition: .2s, border .3s, background-color 0s .3s;

    &::before {
      transition: .2s .2s;
      transform: translate(-50%, -50%)translate(-1px, 11px)rotate(-135deg)scaleY(1);
    }
    &::after {
      transition: .2s .1s;
      transform: translate(-50%, -50%)translate(-5.5px, 4px)rotate(-45deg)scaleY(1);
    }
  }
}

.input-field {
  position: relative;
  display: inline-flex;

  width: 150px;

  transition: .2s;

  &::before, &::after {
    content: '';
    position: absolute;
    inset: auto 0 -2px;

    height: 2px;

  }

  &::before {
    background: r.$bg-mod;
  }
  &::after {
    background: r.$accent;
    transition: .3s r.$easing;
    inset: auto 100% -2px 0;
  }

  &:focus-within {
    &::after {
      inset: auto 0 -2px;
    }
  }

  &__field {
    @include r.input-reset;

    width: 0;
    flex: 1 0 auto;
    padding: .5em .2em .5em 1em;

    &::-webkit-inner-spin-button {
      appearance: none;
    }

    &:focus {
      outline: none;
    }
  }
}

/* Scrollbar */

.scroll {
  overflow: scroll;
  scroll-behavior: smooth;

  &.x {
    overflow: scroll hidden;
  }
  &.y {
    overflow: hidden scroll;
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  &.auto {
    overflow: auto;
    &.x {
      overflow: auto hidden;
    }
    &.y {
      overflow: hidden auto;
    }
  }

  &.show {
    overflow: scroll;
    &.x {
      overflow: scroll hidden;
    }
    &.y {
      overflow: hidden scroll;
    }
  }

  &.auto,
  &.show {
    &::-webkit-scrollbar {
      width: 16px;
      height: 16px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #8888;
      background-clip: padding-box;
      border: 4px solid transparent;
      border-radius: 8px;
      min-height: 100px;

      &:hover {
        background-color: #888a;
      }
    }

    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    &.thin {
      &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border: 2px solid transparent;
        border-radius: 3.5px;
        min-height: 20px;
      }

      &::-webkit-scrollbar-corner {
        background-color: transparent;
      }
    }
  }
}
</style>
