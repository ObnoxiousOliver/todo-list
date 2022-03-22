<template>
<div class="input-field input-field--number">
  <input
    @blur="applyInput"
    @keydown.enter="applyInput"
    @focus="focus = true"
    @wheel="wheel"
    v-model="input"
    class="input-field__field"
    type="number">
  <div class="input-field--number__controls">
    <button class="input-field--number__control input-field--number__control--up" @click.exact="input++; applyInput();" @click.ctrl="input += 10; applyInput();"><i class="bi-chevron-up"/></button>
    <button class="input-field--number__control input-field--number__control--down" @click.exact="input--; applyInput();" @click.ctrl="input -= 10; applyInput();"><i class="bi-chevron-down"/></button>
  </div>
</div>
</template>

<script>
export default {
  emits: [
    'update:value'
  ],
  props: {
    value: Number,
    min: Number,
    max: Number
  },
  data () {
    return {
      input: this.value,
      focus: false
    }
  },
  watch: {
    value () {
      this.input = this.value
    },
    input (val) {
      this.input = Math.min(this.max || Infinity, Math.max(this.min || -Infinity, val))
    },
    min () { this.input = this.value },
    max () { this.input = this.value }
  },
  methods: {
    applyInput () {
      this.focus = false
      if (this.input !== '') {
        this.$emit('update:value', this.input)
      }
      if (this.value) this.input = this.value
    },
    wheel (e) {
      if (!this.focus) return

      e.preventDefault()
      this.input += -e.deltaY / Math.abs(e.deltaY)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.input-field--number {
  &:focus-within, &:hover {
    .input-field--number__control {
      color: inherit;
    }
  }

  &__controls {
    display: flex;
    flex-flow: column nowrap;
  }

  &__control {
    @include r.input-reset;

    flex: 1 1;

    padding: 0 .3em;

    font-size: .7em;
    color: r.$bg-mod;

    cursor: pointer;
    transition: .2s;

    &:hover {
      background: #0001;

      .theme-dark & {
        background: #fff1;
      }
    }
  }
}
</style>
