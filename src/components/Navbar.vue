<template>
  <nav :class="['navbar', config.lockWindow ? 'navbar--lock-window' : '']">
    <div class="drag-area"/>
    <ul class="navbar__list">
      <li
        v-for="link in links"
        :key="link.r"
        class="navbar__list-items">
        <router-link :to="link.r" class="navbar__btn" draggable="false">
          <i :class="link.i"/>
        </router-link>
      </li>
    </ul>
    <div v-if="!config.lockWindow" class="drag-indicator"/>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['config'])
  },
  data: () => ({
    links: [
      // { r: '/', i: 'fas fa-home' },
      { r: '/', i: 'bi-list-task' },
      // { r: '/routine', i: 'bi-table' },
      // { r: '/birthdays', i: 'fas fa-birthday-cake' },
      { r: '/settings', i: 'bi-gear-fill' }
    ]
  })
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.navbar {
  position: relative;
  box-shadow: #0004 0 0 1em;

  .drag-area {
    -webkit-app-region: drag;
    position: absolute;
    inset: 5px 5px 0;
  }

  .drag-indicator {
    position: absolute;
    inset: 0 0 0 auto;

    height: 7px;
    width: 14px;
    margin: 23.5px 25px;
    border-top: #777 solid 2px;
    border-bottom: #777 solid 2px;
  }

  .current-page {
    padding: 12px 25px;
    width: 115px;

    color: r.$accent;
    line-height: 30px;
  }

  &__list {
    display: flex;
    padding: 0;
    margin: 0;

    list-style-type: none;
  }

  &__list-items {
    display: block;
  }

  &__btn {
    position: relative;

    display: inline-block;
    padding: 12px 25px;

    outline-offset: -2px;

    color: #777;
    text-decoration: none;
    font-size: 1.2em;
    line-height: 30px;

    -webkit-app-region: no-drag;
    transition: .2s;
    cursor: pointer;

    &:hover {
      background: #0001;

      &:active {
        transform: scale(0.96);
      }

      .theme-dark & {
        background: #fff1;
      }
    }

    &::after {
      position: absolute;
      inset: auto 50% 0;

      background: #0000;
      height: 3px;

      content: '';
      transition: inset .3s, background-color 0s .3s;
      transition-timing-function: r.$easing;
    }

    &.router-link-active {
      color: r.$accent;

      &::after {
        inset: auto 10px 0;
        background: r.$accent;
        transition: inset .3s;
      }
    }
  }

  &--lock-window {
    .drag-area {
      -webkit-app-region: no-drag;
    }
  }
}
</style>
