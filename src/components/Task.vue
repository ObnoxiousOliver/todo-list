<template>
  <div class="task">
    <input class="input input--checkbox" type="checkbox">
    <Input v-model:value="taskData.name"/>
    <div class="task__controls">
      <button @click="addTask" class="task__control">
        <i class="bi-plus-lg"/>
      </button>
    </div>
    <transition name="task__subtasks">
      <div v-if="taskData.tasks && taskData.tasks.length" class="task__subtasks">
        <transition-group name="task">
          <Task v-for="task in subTasks" :task="task" :key="task.id" />
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import Input from './Input.vue'

export default {
  emits: [
    'update:task'
  ],
  components: {
    Input,
    Task: this
  },
  data: () => ({
    taskData: {
      name: '',
      checked: false,
      tasks: []
    },
    subTasks: []
  }),
  props: {
    task: { type: Object, default: () => ({}) }
  },
  watch: {
    task: {
      deep: true,
      handler (val) {
        this.taskData = val
      }
    },
    taskData: {
      deep: true,
      handler (val) {
        this.$emit('update:task', val)
        this.taskData = this.task

        setTimeout(() => {
          this.subTasks = val.tasks
        })
      }
    }
  },
  mounted () {
    this.taskData = this.task
  },
  methods: {
    addTask () {
      if (!this.taskData.tasks) this.taskData.tasks = []
      this.taskData.tasks.push({})
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.task {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: .2em 0;

  .input-field {
    width: 100%;
    font-weight: 500;
  }

  &__drag-indicator {
    height: 7px;
    width: 14px;
    margin: 0 1em;
    border-top: #8888 solid 2px;
    border-bottom: #8888 solid 2px;
  }

  .input--checkbox {
    margin: 0 1em;
  }

  &__subtasks {
    grid-row: 2;
    grid-column: span 3;
    border-left: r.$bg-mod solid 2px;
    margin: .3em 0 0 1em;
    padding-bottom: .1em;

    transition: .2s;

    &:focus-within {
      border-left: rgba(r.$accent, 0.7) solid 2px;
      // background: rgba(r.$accent, 0.1);

      // .theme-dark & {
      //   background: rgba(r.$accent, 0.05);
      // }
    }

    &-enter-active, &-leave-active {
      transition: padding-bottom .3s, margin-top .3s;
      transition-timing-function: r.$easing;
    }
    &-enter-from, &-leave-to {
      padding-bottom: 0;
      margin-top: 0;
    }
  }

  &__controls {
    margin: 0 .4em;
  }

  &__control {
    @include r.input-reset;

    border-radius: 50%;
    line-height: 20px;
    width: 30px;
    height: 30px;

    color: #8888;

    transform: translateY(.2em);
    transition: .2s;
    cursor: pointer;

    &:hover {
      background: r.$bg-mod;
      color: inherit;
    }

    [class*='-lg'] {
      font-size: .85em;
    }
  }
}
</style>
