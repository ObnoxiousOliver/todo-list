<template>
  <div class="tasks-view">
    <div class="controls">
      <button class="controls__btn" @click="tasks.push({})">
        <i class="bi-plus-lg"/>
      </button>
    </div>
    <div class="wrapper">
      <TasksList v-model:tasks="tasks"/>
      {{ tasks }}
    </div>
  </div>
</template>

<script>
import TasksList from '../components/TasksList.vue'

export default {
  components: {
    TasksList
  },
  data: () => ({
    /*
    Task = {
      name: String,
      checked: Boolean,
      tasks: Array<Task>
    }
    */
    tasks: []
  }),
  watch: {
    tasks: {
      deep: true,
      handler () {
        this.giveRandomId(this.tasks)
      }
    }
  },
  mounted () {
    this.giveRandomId(this.tasks)
  },
  methods: {
    giveRandomId (tasks) {
      tasks.forEach(t => {
        if (!t.id) {
          t.id = Array.apply(null, new Array(8))
            .map((x, i) => Math.floor(Math.random() * 10))
            .reduce((a, b, i) => a + b * i ** 10, 0)
        }

        if (t.tasks) this.giveRandomId(t.tasks)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.wrapper {
  margin: 0 .5em;
}

.controls {
  position: sticky;
  top: 0;
  z-index: 1;

  background: r.$bg-light;
  border-top: r.$bg-mod solid 1px;
  box-shadow: #0003 0 0 1em;

  animation: controlsEnter .3s r.$easing forwards;

  @keyframes controlsEnter {
    from {
      transform: translateY(-100%);
    }
  }

  .theme-dark & {
    background: r.$bg-dark;
  }

  &__btn {

  }
}
</style>
