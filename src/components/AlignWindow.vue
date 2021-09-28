<template>
  <div class="align-window">
    <DropdownMenu ref="screens" @itemselected="(x) => screen = x.index" :data="allDisplays.map((display, i) => ({
        content: `${i + 1}: ${ display.size.width } x ${ display.size.height } ${ display.displayFrequency }hz`,
        index: i
      }))"/>
    <button @click="updateWindowPos">Reset to current screen Position</button>
    <button @click="applyPos">Apply</button><br>
    {{ cdw }} x {{ cdh }} {{ currentDisplay.displayFrequency }}hz
    <div class="align-window__screen" :style="{ 'aspect-ratio': aspectRatio }">
      <div class="align-window__window align-window__area"
        :style="{
          top: (w_top / wah + taskbarAreaRaw.top) * 100 + '%',
          right: (w_right / waw + taskbarAreaRaw.right) * 100 + '%',
          bottom: (w_bottom / wah + taskbarAreaRaw.bottom) * 100 + '%',
          left: (w_left / waw + taskbarAreaRaw.left) * 100 + '%'
        }">

      </div>
      <div class="align-window__taskbar align-window__area" :style="{ top: taskbarArea.top * 100 + '%', right: 0, bottom: 0, left: 0 }"/>
      <div class="align-window__taskbar align-window__area" :style="{ right: taskbarArea.right * 100 + '%', top: 0, bottom: 0, left: 0 }"/>
      <div class="align-window__taskbar align-window__area" :style="{ bottom: taskbarArea.bottom * 100 + '%', right: 0, top: 0, left: 0 }"/>
      <div class="align-window__taskbar align-window__area" :style="{ left: taskbarArea.left * 100 + '%', top: 0, bottom: 0, right: 0 }"/>
    </div>
    <div class="align-window__controls">
      <table>
        <tbody>
          <tr><td>Width</td><td>    <NumberInput v-model:value="w_width"/></td></tr>
          <tr><td>Height</td><td>   <NumberInput v-model:value="w_height"/></td></tr>
          <tr><td>X</td><td>        <NumberInput v-model:value="w_x"/></td></tr>
          <tr><td>Y</td><td>        <NumberInput v-model:value="w_y"/></td></tr>
          <tr><td>Top</td><td>      <NumberInput v-model:value="w_top"/></td></tr>
          <tr><td>Right</td><td>    <NumberInput v-model:value="w_right"/></td></tr>
          <tr><td>Bottom</td><td>   <NumberInput v-model:value="w_bottom"/></td></tr>
          <tr><td>Left</td><td>     <NumberInput v-model:value="w_left"/></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import NumberInput from '../components/NumberInput.vue'
import DropdownMenu from '../components/DropdownMenu.vue'
import { mapActions } from 'vuex'

const clamp = (val, min, max) => Math.max(Math.min(val, max), min)

export default {
  components: {
    NumberInput,
    DropdownMenu
  },
  computed: {
    currentDisplay () {
      return this.allDisplays[this.screen]
    },
    cdh () { return this.currentDisplay.size.height },
    cdw () { return this.currentDisplay.size.width },
    wah () { return this.currentDisplay.workArea.height },
    waw () { return this.currentDisplay.workArea.width },
    aspectRatio () { return this.cdw / this.cdh },
    taskbarArea () {
      var wa = this.currentDisplay.workArea
      var b = this.currentDisplay.bounds

      return {
        top: (wa.y + wa.height - b.y) / b.height,
        right: (b.x + b.width - wa.x) / b.width,
        bottom: (b.y + b.height - wa.y) / b.height,
        left: (wa.x + wa.width - b.x) / b.width
      }
    },
    taskbarAreaRaw () {
      var wa = this.currentDisplay.workArea
      var b = this.currentDisplay.bounds

      return {
        top: (wa.y - b.y) / b.height,
        right: ((b.x + b.width) - (wa.x + wa.width)) / b.width,
        bottom: ((b.y + b.height) - (wa.y + wa.height)) / b.height,
        left: (wa.x - b.x) / b.width
      }
    },
    w_height: {
      get () { return this.wah - (this.w_top + this.w_bottom) },
      set (val) { this.w_bottom = this.wah - (this.w_top + Math.max(val, this.minHeight)) }
    },
    w_width: {
      get () { return this.waw - (this.w_left + this.w_right) },
      set (val) { this.w_right = this.waw - (this.w_left + Math.max(val, this.minWidth)) }
    },
    w_x: {
      get () { return this.w_left },
      set (val) {
        var w = this.w_width
        this.w_left = val
        this.w_width = w
      }
    },
    w_y: {
      get () { return this.w_top },
      set (val) {
        var h = this.w_height
        this.w_top = val
        this.w_height = h
      }
    }
  },
  data: () => ({
    allDisplays: null,
    screen: 0,
    w_top: 0,
    w_right: 0,
    w_bottom: 0,
    w_left: 0,
    minWidth: 400,
    minHeight: 500
  }),
  watch: {
    screen (val) {
      this.w_width = Math.max(this.w_width, this.minWidth)
      this.w_height = Math.max(this.w_height, this.minHeight)

      setTimeout(() => {
        this.$refs.screens.setIndex(val)
      })
    },
    w_top (val) {
      this.w_top = clamp(val, 0, this.wah - this.minHeight)
      this.w_bottom = clamp(this.w_bottom, 0, this.wah - (val + this.minHeight))
    },
    w_right (val) {
      this.w_right = clamp(val, 0, this.waw - this.minWidth)
      this.w_left = clamp(this.w_left, 0, this.waw - (val + this.minWidth))
    },
    w_bottom (val) {
      this.w_bottom = clamp(val, 0, this.wah - this.minHeight)
      this.w_top = clamp(this.w_top, 0, this.wah - (val + this.minHeight))
    },
    w_left (val) {
      this.w_left = clamp(val, 0, this.waw - this.minWidth)
      this.w_right = clamp(this.w_right, 0, this.waw - (val + this.minWidth))
    }
  },
  beforeMount () {
    this.updateWindowPos()
  },
  methods: {
    ...mapActions([
      'setConfigEntry'
    ]),
    updateWindowPos () {
      var bounds = ipcRenderer.sendSync('getBounds')
      this.allDisplays = ipcRenderer.sendSync('getAllDisplays')

      const isIn = (val, min, max) => min < val && val < max

      this.allDisplays.forEach((display, i) => {
        var db = display.bounds

        if (isIn(bounds.x, db.x, db.x + db.width) && isIn(bounds.y, db.y, db.y + db.height)) {
          this.screen = i

          this.w_width = bounds.width
          this.w_height = bounds.height
          this.w_x = bounds.x - db.x
          this.w_y = bounds.y - db.y
          this.applyPos()
        }
      })
    },
    applyPos () {
      var wa = this.currentDisplay.workArea

      var bounds = {
        width: this.w_width,
        height: this.w_height,
        x: wa.x + this.w_x,
        y: wa.y + this.w_y
      }

      ipcRenderer.send('setBounds', bounds)

      this.setConfigEntry({ bounds })
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;
@use 'sass:math';

.align-window {
  margin: 1em 0 0;

  &__screen {
    position: relative;
    box-shadow: rgba(r.$accent, .8) 0 0 0 2px;
    margin: 2px;
    background: rgba(r.$accent, .1);
    overflow: hidden;
    transition: .3s r.$easing;
  }

  &__area {
    position: absolute;

    transition: .3s r.$easing;
  }

  &__window {
    box-shadow: #e4d167 0 0 0 2px inset;
    background: repeating-linear-gradient(-45deg,
      #e4d16722 0px,
      #e4d16722 math.sqrt(2) * 3 + px,
      #e4d16755 math.sqrt(2) * 3 + px,
      #e4d16755 math.sqrt(2) * 5 + px);
  }

  &__taskbar {
    box-shadow: #f15151 0 0 0 2px inset;
    background: repeating-linear-gradient(-45deg,
      #f1515144 0px,
      #f1515144 math.sqrt(2) * 3 + px,
      #f1515188 math.sqrt(2) * 3 + px,
      #f1515188 math.sqrt(2) * 5 + px);
  }

  &__input {
    background: unset;
    border: unset;
    color: inherit;
    text-align: right;
    font: inherit;

    width: 80px;

    border-bottom: currentColor solid 1px;
    transition: border .3s;
    transition-timing-function: r.$easing;

    &:focus {
      outline: none;
      border-color: r.$accent;
    }
  }
}
</style>
