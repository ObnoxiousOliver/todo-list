<template>
  <button @click="open = !open">Pick a Date</button>
  <div class="date-picker">
    <transition name="date-picker__popup">
      <div v-if="open" class="date-picker__popup">
        <NumberInput :min="1" :max="daysInMonth" v-model:value="day"/>/
        <NumberInput :min="1" :max="12" v-model:value="month"/>/
        <NumberInput :min="1970" v-model:value="year"/>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import NumberInput from './NumberInput.vue'

export default {
  emits: [
    'update:date'
  ],
  components: {
    NumberInput
  },
  props: {
    date: String
  },
  computed: {
    daysInMonth () {
      console.log(this.moment.daysInMonth())
      return this.moment.daysInMonth()
    }
  },
  data () {
    var now = moment(this.date)

    return {
      moment: now,
      year: now.year(),
      month: now.month() + 1,
      day: now.date(),
      open: false
    }
  },
  watch: {
    year (val) {
      this.moment.year(val)
    },
    month (val) {
      if (this.moment.month() + 1 !== val) {
        this.moment.month(val + 1)
      }
    },
    day (val) {
      this.moment.date(val)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.date-picker {
  position: relative;

  &__popup {
    z-index: 1;
    position: absolute;
    top: calc(100% + 1rem);
    right: 0;
    background: r.$bg-light;
    padding: 1rem;
    box-shadow: #0004 0 5px 20px;
    border-radius: .5rem;

    display: flex;
    gap: 5px;
    align-items: center;

    .input-field {
      width: 80px;
    }

    .theme-dark & {
      background: r.$bg-dark;
    box-shadow: #0006 0 5px 20px;
    }
  }
}
</style>
