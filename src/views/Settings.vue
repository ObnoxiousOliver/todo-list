<template>
  <div class="settings-view">
    <div class="wrapper">
      <div class="setting__container">
        <label class="setting__label">Select Theme:</label>
        <div class="setting__input">
          <button :class="['theme-btn', 'theme-btn--dark', config.theme === 'dark' ? 'active' : '']" @click="this.setConfigEntry({ theme: 'dark' })"/>
          <button :class="['theme-btn', 'theme-btn--light', config.theme === 'light' ? 'active' : '']" @click="this.setConfigEntry({ theme: 'light' })"/>
        </div>
      </div>
      <div class="setting__container align-window">
        <label class="setting__label">Align Window:</label>
        <AlignWindow/>
      </div>
      <div class="setting__container">
        <label class="setting__label" for="lock-window">Lock Window:</label>
        <div class="setting__input">
          <input v-model="lockWindow" class="input input--checkbox" type="checkbox" name="lock-window" id="lock-window">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions, mapState } from 'vuex'
import AlignWindow from '../components/AlignWindow.vue'

export default {
  components: {
    AlignWindow
  },
  computed: {
    ...mapState([
      'config'
    ])
  },
  data: () => ({
    lockWindow: false
  }),
  watch: {
    lockWindow (val) {
      ipcRenderer.send('lockWindow', val)
      this.setConfigEntry({
        lockWindow: val
      })
    }
  },
  mounted () {
    this.lockWindow = this.config.lockWindow
  },
  methods: {
    ...mapActions([
      'setConfigEntry'
    ]),
    toggleTheme () {
      this.setConfigEntry({
        theme: this.config.theme === 'light' ? 'dark' : 'light'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.wrapper {
  max-width: 35em;
  margin: 1em auto 4em;
  padding: 0 16px;
}

.setting {
  &__container {
    display:  flex;
    flex-flow: row nowrap;
    align-items: center;

    padding: 1em;

    border-bottom: r.$bg-mod solid 1px;
  }
  &__label {
    display: inline-block;
    flex: 1 1 0;
  }
  &__input {
    display:  flex;
    flex-flow: row nowrap;
    align-items: center;
  }
}

.theme-btn {
  display: block;

  height: 3em;
  width: 3em;
  margin-left: .5em;
  border-radius: 50%;
  border: none;

  cursor: pointer;
  transition: .2s r.$easing;

  &--light {
    background: r.$bg-light;
  }
  &--dark {
    background: r.$bg-dark;
  }

  &.active {
    border: r.$accent solid 2px;
  }
}

.align-window {
  display: block;
}
</style>
