<template>
<div class="input-field input-field--text">
  <input
    @blur="applyInput"
    @keydown.enter="applyInput"
    @focus="focus = true"
    v-model="input"
    class="input-field__field"
    type="text">
</div>
</template>

<script>
export default {
  emits: [
    'update:value'
  ],
  props: {
    value: String
  },
  data () {
    return {
      input: this.value
    }
  },
  watch: {
    value () {
      this.input = this.value
    }
  },
  methods: {
    applyInput () {
      this.$emit('update:value', this.input)
      if (this.value) this.input = this.value
    }
  }
}
</script>
