<template>
  <div class="scroll-view">
    <div
      ref="viewer"
      class="scroll-view__viewer"
      @scroll="content_scroll"
      :style="{ 'scroll-behavior': dragging ? 'unset' : '' }">
      <div ref="content" class="scroll-view__content">
        <slot/>
      </div>
    </div>
    <div
      ref="track"
      @mousedown="track_mousedown"
      class="scroll-view__track">
      <div
        v-if="thumbHeight"
        ref="thumb"
        @mousedown="thumb_mousedown"
        class="scroll-view__thumb"
        :style="{
          top: scrollTop + 'px',
          height: thumbHeight + 'px'
        }">
          <div class="scroll-view__thumb-element"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
  },
  data: () => ({
    scrollTop: 0,
    thumbHeight: 100,
    mounted: false,
    ro: null,
    dragging: false
  }),
  mounted () {
    this.mounted = true

    this.ro = new ResizeObserver(() => {
      this.updateScroller()
    })
    this.ro.observe(this.$refs.content)
    this.ro.observe(this.$refs.viewer)
    setTimeout(() => {})
    this.updateScroller()
  },
  unmounted () {
    this.ro.disconnect()
  },
  methods: {
    updateScroller () {
      // const c = this.$refs.content
      const v = this.$refs.viewer
      if (v.clientHeight === v.scrollHeight) {
        this.thumbHeight = null
        return
      }

      this.thumbHeight = Math.max((v.clientHeight ** 2) / v.scrollHeight, 100)
    },
    content_scroll (e) {
      var v = this.$refs.viewer
      this.scrollTop = (v.scrollTop / (v.scrollHeight - v.clientHeight)) * (v.clientHeight - this.thumbHeight)
    },
    track_mousedown (e) {
      const thumb = this.$refs.thumb
      const track = this.$refs.track
      const v = this.$refs.viewer

      if (e.path.includes(thumb)) return

      var rect = track.getBoundingClientRect()

      var halfThumb = this.thumbHeight * 0.5

      v.scrollTop = Math.min(Math.max(((e.clientY - rect.y - halfThumb) / rect.height) * v.scrollHeight, 0), v.scrollHeight)
    },
    thumb_mousedown (e) {
      const thumb = this.$refs.thumb
      const track = this.$refs.track
      const v = this.$refs.viewer
      const _this = this

      document.addEventListener('mousemove', docMouseMove)
      document.addEventListener('mouseup', docMouseUp)
      _this.dragging = true

      var rect = track.getBoundingClientRect()
      var offset = e.clientY - thumb.getBoundingClientRect().y

      function docMouseMove (e) {
        rect = track.getBoundingClientRect()

        v.scrollTop = Math.min(Math.max(((e.clientY - rect.y - offset) / rect.height) * v.scrollHeight, 0), v.scrollHeight)
      }
      function docMouseUp (e) {
        document.removeEventListener('mousemove', docMouseMove)
        document.removeEventListener('mouseup', docMouseUp)
        _this.dragging = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.scroll-view {
  position: relative;
  height: 100%;

  &__viewer {
    position: absolute;
    inset: 0;
    overflow: scroll;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      appearance: none;
      width: 0;
      height: 0;
    }
  }

  &__track {
    position: absolute;
    inset: 0 0 0 auto;

  }
  &__thumb {
    position: relative;
    padding: 4px;
  }

  &__thumb-element {
    width: 4px;
    height: 100%;

    background: r.$bg-mod;
    border-radius: 2px;
  }
}
</style>
