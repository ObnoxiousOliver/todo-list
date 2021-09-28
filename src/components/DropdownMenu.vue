<template>
  <div
    class="dropdown"
    @keydown.esc="closeDropdown"
  >
    <button
      @click="toggleDropdown"
      @mousewheel.prevent="dropdownScroll"
      @keydown.prevent.up="indexUp"
      @keydown.prevent.down="indexDown"
      :class="['dropdown__button', dropdownOpen ? 'dropdown__button--open' : '']"
      ref="dropdownButton"
    >
      <div class="dropdown__button__content" v-html="data[selectedIndex] ? data[selectedIndex].content : ''" />
      <div class="dropdown__button__arrow">
        <i class="bi-chevron-down" />
      </div>
    </button>
    <transition name="dropdown__menu">
      <div v-if="dropdownOpen" class="dropdown__menu scroll y auto thin">
        <button
          v-for="(item, index) in data"
          @click="selectedIndex = index"
          :key="index"
          :class="['dropdown__menu__option', selectedIndex === index ? 'active' : '']"
          v-html="item.content"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'DropdownMenu',
  props: {
    data: Array,
    defaultIndex: Number
  },
  data: () => ({
    selectedIndex: 0,
    dropdownOpen: false
  }),
  watch: {
    selectedIndex (val) {
      this.$emit('itemselected', this.data[val])
    }
  },
  mounted () {
    this.selectedIndex = this.defaultIndex | 0
  },
  methods: {
    dropdownScroll (e) {
      if (e.deltaY > 0) this.indexDown()
      else this.indexUp()
    },
    indexDown () {
      if (this.selectedIndex < this.data.length - 1) this.selectedIndex += 1
    },
    indexUp () {
      if (this.selectedIndex > 0) this.selectedIndex -= 1
    },
    setIndex (index) {
      if (index >= 0 && index < this.data.length) {
        this.selectedIndex = index
        this.$emit('itemselected', this.data[index])
      }
    },
    toggleDropdown () {
      if (this.dropdownOpen) this.closeDropdown()
      else this.openDropdown()
    },
    openDropdown () {
      this.dropdownOpen = true
      setTimeout(() => {
        document.addEventListener('click', this.documentClick)
        document.addEventListener('keydown', this.documentKeydown)
      })
    },
    closeDropdown () {
      this.dropdownOpen = false
      document.removeEventListener('click', this.documentClick)
      document.removeEventListener('keydown', this.documentKeydown)
    },
    documentClick () {
      this.closeDropdown()
    },
    documentKeydown (e) {
      if (!e.path.includes(this.$el)) {
        this.closeDropdown()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.dropdown {
  position: relative;

  &__button {
    @include r.input-reset;

    position: relative;
    display: flex;
    width: 100%;

    border: r.$bg-mod solid 2px;
    padding: .5em 1em;
    border-radius: 5px;

    text-align: left;

    cursor: pointer;
    transition: .2s r.$easing;

    &:hover {
      background: #8882;
      box-shadow: #0004 0 2px 5px;
    }

    &:disabled {
      opacity: 0.5;
    }

    &--open {
      z-index: 11;
      border-radius: 5px 5px 0 0;

      .dropdown__button__arrow {
        transform: rotate(180deg);
      }
    }

    &__content {
      flex: 1 1 auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__arrow {
      margin-left: 5px;
      transition: transform .2s r.$easing;
    }
  }

  &__menu {
    position: absolute;
    z-index: 10;
    top: 100%;

    min-width: 150px;
    max-height: 30vh;
    width: 100%;
    overflow: hidden;

    background: r.$bg-light;
    padding: .5em 0;
    border: r.$bg-mod solid 2px;
    border-top-width: 0;
    border-radius: 0 0 5px 5px;
    box-shadow: #0004 0 2px 5px;

    .theme-dark & {
      background: r.$bg-dark;
    }

    &__option {
      @include r.input-reset;
      display: block;

      width: 100%;
      padding: .5em 1em;

      text-align: left;

      cursor: pointer;
      transition: .2s;

      &:hover {
        background: r.$bg-mod;
      }
      &.active {
        background: r.$accent;
        color: #fff;
      }
    }

    &-enter-active,
    &-leave-active {
      clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 0);
      transform: none;
      transition: .2s r.$easing;
    }

    &-leave-active {
      pointer-events: none;
    }

    &-enter-from,
    &-leave-to {
      transform: translateY(-50%);
      clip-path: polygon(
        0 50%,
        0 50%,
        100% 50%,
        100% 50%);
    }
  }
}
</style>
