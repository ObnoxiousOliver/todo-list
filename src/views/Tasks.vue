<template>
  <div class="tasks-view">
    <div class="controls">
      <button class="controls__btn" @click="tasks.push({})">
        <i class="bi-plus-lg"/>
      </button>
      <div class="task-controls">
        <input
          type="checkbox"
          :disabled="!focusedTask"
          class="input input--checkbox"
          v-model="dueDateActive">
        <!-- <DatePicker/> -->
        <input type="datetime-local" class="datepicker" v-model="dueDate" :disabled="!focusedTask">
        <button :disabled="!focusedTask" class="controls__btn" @click="addSubTask">
          <i class="bi-plus-lg"/>
        </button>
        <button :disabled="!focusedTask" class="controls__btn" @click="removeTask">
          <i class="bi-dash-lg"/>
        </button>
      </div>
    </div>
    <div class="wrapper">
      <TasksList @taskFocus="taskFocus" @taskRemoved="taskRemoved" v-model:tasks="tasks" :animate="mounted" :focused="(focusedTask || {}).id"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import { mapActions, mapState } from 'vuex'
import TasksList from '../components/TasksList.vue'
// import DatePicker from '../components/DatePicker.vue'

export default {
  components: {
    TasksList
    // DatePicker
  },
  computed: {
    ...mapState([
      'config'
    ]),
    dueDateActive: {
      get () {
        return this.focusedTask &&
          this.focusedTask.task.taskData &&
          this.focusedTask.task.taskData.due &&
          this.focusedTask.task.taskData.due !== null
      },
      set (val) {
        if (this.focusedTask) {
          this.dueDate = val ? moment(moment().add('days', 1).format('DD-MM-YYYY'), 'DD-MM-YYYY') : null
        }
      }
    },
    dueDate: {
      get () {
        return this.focusedTask &&
          this.focusedTask.task.taskData &&
          this.focusedTask.task.taskData.due &&
          moment(this.focusedTask.task.taskData.due, true).format('YYYY-MM-DDTHH:mm')
      },
      set (val) {
        console.log(val)
        if (this.focusedTask) {
          var date = moment(val, 'YYYY-MM-DDTHH:mm', true)

          if (date.isValid()) {
            this.focusedTask.task.taskData.due = date.format()
          } else {
            this.focusedTask.task.taskData.due = null
          }
        }
      }
    }
  },
  data: () => ({
    /*
    Task = {
      name: String,
      checked: Boolean,
      tasks: Array<Task>,
      collapsed: Boolean,
      height: Number,
      due: String
    }
    */
    tasks: [],
    focusedTask: null,
    mounted: false
  }),
  watch: {
    tasks: {
      deep: true,
      handler () {
        this.giveRandomId(this.tasks)
        this.setConfigEntry({
          tasks: this.tasks
        })
      }
    }
  },
  beforeMount () {
    this.tasks = this.config.tasks || []
    this.giveRandomId(this.tasks)
    setTimeout(() => {
      this.mounted = true
    })
  },
  mounted () {
    window.addEventListener('blur', this.docBlur)
  },
  unmounted () {
    window.removeEventListener('blur', this.docBlur)
  },
  methods: {
    ...mapActions([
      'setConfigEntry'
    ]),
    docBlur () {
      console.log('blur')
      this.focusedTask = null
    },
    giveRandomId (tasks) {
      tasks.forEach(t => {
        if (!t.id) {
          t.id = Array.apply(null, new Array(8))
            .map((x, i) => Math.floor(Math.random() * 10))
            .reduce((a, b, i) => a + b * i ** 10, 0)
        }

        if (t.tasks) this.giveRandomId(t.tasks)
      })
    },
    taskFocus (id, task) {
      this.focusedTask = { id, task }
    },
    taskRemoved () {
      this.focusedTask = null
    },
    addSubTask () {
      if (this.focusedTask) {
        this.focusedTask.task.addSubTask()
      }
    },
    removeTask () {
      if (this.focusedTask) {
        this.focusedTask.task.removeTask()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss' as r;

.wrapper {
  margin: 0 .5em 15rem;
}

.datepicker {
  @include r.input-reset;

  border: r.$bg-mod solid 2px;
  border-radius: 6px;
  padding: 0 .5rem;

  &::-webkit-calendar-picker-indicator {
    flex: 0 0 auto;
    color: inherit;
    background: r.$bg-mod;
    border-radius: 50%;
    width: 8px;
    height: 10px;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.3;
  }
}

.controls {
  z-index: 1;
  position: sticky;
  top: 0;

  display: flex;

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
    @include r.input-reset;
    display: flex;

    color: #8888;

    transition: .2s;
    cursor: pointer;
    padding: .6rem .9rem;
    font-size: 1.1rem;
    justify-content: center;
    align-items: center;

    &:hover:not(:disabled) {
      background: r.$bg-mod;
      color: inherit;
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }

    [class*='-lg'] {
      font-size: .85rem;
    }
  }

  .task-controls {
    flex: 1 0 auto;
    display: flex;
    justify-content: flex-end;
    margin: .5rem 0 .5rem .2rem;
    padding-left: .2rem;
    border-left: r.$bg-mod solid 1px;

    .controls__btn {
      margin: -.5rem 0;
    }
  }
}
</style>
