<template>
  <div :class="['task', taskData.checked && 'task--checked', taskData.id === focused && 'task--focused']">
    <input @focus="emitTaskFocus" class="input input--checkbox" type="checkbox" v-model="taskData.checked">
    <Input @inputFocus="emitTaskFocus" v-model:value="taskData.name"/>
    <div class="task__due-date">
      {{ dueDate }}
    </div>
    <div class="task__controls">
      <button
        v-if="subTasks && subTasks.length"
        :class="['task__control', !taskData.collapsed ? 'open' : '']"
        @focus="emitTaskFocus"
        @click="toggleSubtasks">
        <i class="bi-chevron-down"/>
      </button>
      <button @focus="emitTaskFocus" @click="addSubTask" class="task__control">
        <i class="bi-plus-lg"/>
      </button>
      <!-- <button @focus="emitTaskFocus" @click="removeTask" class="task__control">
        <i class="bi-dash-lg"/>
      </button> -->
    </div>
    <!-- <div class="task__move">
      <i class="bi-chevron-expand"/>
    </div > -->
    <transition name="task__subtasks">
      <div
        v-if="!taskData.collapsed"
        :style="{ '--height': taskData.height + 'px' }"
        ref="subtasks"
        :class="[
          'task__subtasks',
          taskData.tasks && taskData.tasks.length
            ? '' : 'task__subtasks--no-tasks'
          ]">
        <transition-group name="task" :css="animate">
          <Task :focused="focused" @taskFocus="taskFocus" @taskRemoved="$emit('taskRemoved')" v-for="task in subTasks" :task="task" :key="task.id" :animate="animate" @removeTask="removeSubTask"/>
        </transition-group>
      </div>
      <div class="task__subtasks-collapsed" v-else>
        <i class="bi-three-dots-vertical"/>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import Input from './Input.vue'

export default {
  emits: [
    'update:task',
    'removeTask',
    'taskFocus',
    'taskBlur',
    'taskRemoved'
  ],
  components: {
    Input,
    Task: this
  },
  data: () => ({
    taskData: {
      name: '',
      checked: false,
      tasks: [],
      collapsed: false,
      height: null,
      due: null
    },
    subTasks: [],
    dueDate: '',
    dueDateState: 0,
    dueDateUpdate: null
  }),
  props: {
    task: { type: Object, default: () => ({}) },
    animate: Boolean,
    focused: Number
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

        if (this.animate) {
          setTimeout(() => { this.subTasks = val.tasks })
        } else {
          this.subTasks = val.tasks
        }

        if (this.taskData.due) {
          this.setDueDateUpdateInterval()
        } else {
          this.dueDate = ''
          this.dueDateState = 0
          clearInterval(this.dueDateUpdate)
        }
      }
    }
  },
  mounted () {
    this.taskData = this.task
    if (this.taskData.due) {
      this.setDueDateUpdateInterval()
    }
  },
  unmounted () {
    clearInterval(this.dueDateUpdate)
  },
  methods: {
    setDueDateUpdateInterval () {
      if (this.dueDateUpdate) clearInterval(this.dueDateUpdate)

      const date = moment(this.taskData.due)

      const update = () => {
        const now = moment()

        var diff = date.diff(now)
        var duration = moment.duration(diff)

        var day = duration.days()
        var hour = duration.hours()
        var minute = duration.minutes()

        // this.dueDateState = day ? 0 : minute

        this.dueDate = day
          ? day + (Math.abs(day) === 1 ? ' Day' : ' Days')
          : (hour ? hour + (Math.abs(hour) === 1 ? ' Hour' : ' Hours ') : '') +
            minute + (Math.abs(minute) === 1 ? ' Minute' : ' Minutes')
      }

      update()

      setInterval(update, 60000)
    },
    toggleSubtasks () {
      if (!this.taskData.collapsed) this.taskData.height = this.$refs.subtasks.getBoundingClientRect().height
      setTimeout(() => {
        this.taskData.collapsed = !this.taskData.collapsed
      })
    },
    addSubTask () {
      if (!this.taskData.tasks) this.taskData.tasks = []
      this.taskData.tasks.push({})
    },
    removeSubTask (id) {
      if (this.taskData.tasks) {
        this.taskData.tasks = this.taskData.tasks.filter(x => x.id !== id)
      }
    },
    removeTask () {
      this.$emit('removeTask', this.taskData.id)
      this.$emit('taskRemoved')
    },
    taskFocus (id, task) {
      this.$emit('taskFocus', id, task)
    },
    emitTaskFocus () {
      this.$emit('taskFocus', this.taskData.id, this)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.task {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  padding: .2em 0;

  transition: .2s;

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

  &__subtasks-collapsed {
    grid-column: span 4;
    color: r.$bg-mod;
    margin-left: .8rem;
    height: 2rem;
    line-height: 2rem;
    font-size: 1.3rem;
  }

  &__subtasks {
    grid-row: 2;
    grid-column: span 4;
    border-left: r.$bg-mod solid 2px;
    margin: .3em 0 0 1em;
    padding-bottom: .1em;

    transition: .3s r.$easing;

    &:focus-within {
      border-left: rgba(r.$accent, 0.7) solid 2px;
      // background: rgba(r.$accent, 0.1);

      // .theme-dark & {
      //   background: rgba(r.$accent, 0.05);
      // }
    }

    &--no-tasks {
      margin-top: 0;
      padding-bottom: 0;
    }

    &-enter-active, &-leave-active {
      transition: .3s r.$easing;
      overflow: hidden;
    }
    &-enter-to, &-leave-from {
      &:not(.task__subtasks-collapsed) {
        height: var(--height);
      }
    }
    &-enter-from, &-leave-to {
      height: 0;
      opacity: 0;
      padding-bottom: 0;
      margin-top: 0;
    }
  }

  &__due-date {
    color: #f55;
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
      font-size: .85rem;
    }

    i {
      display: inline-block;
      transition: transform .3s r.$easing;
    }

    &.open i {
      transform: rotate(180deg);
    }
  }

  &__move {
    color: #8888;
    height: 30px;
    padding: 10px 0 0 7px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    transition: .2s r.$easing;

    &:hover {
      color: inherit;
    }
  }

  &--checked {
    .input-field {
      opacity: 0.2;
    }
  }
  &--focused {
    background: rgba(r.$accent, 0.1);
  }
}
</style>
