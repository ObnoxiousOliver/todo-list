<template>
  <transition-group name="task" :css="animate">
    <Task
      v-for="task in tasksData"
      @taskFocus="taskFocus"
      @taskRemoved="$emit('taskRemoved')"
      @removeTask="removeTask"
      :focused="focused"
      :task="task"
      :key="task.id"
      :animate="animate"/>
  </transition-group>
</template>

<script>
import Task from './Task.vue'

export default {
  components: {
    Task
  },
  emits: [
    'update:tasks',
    'taskFocus',
    'taskBlur',
    'taskRemoved'
  ],
  props: {
    tasks: Array,
    animate: Boolean,
    focused: Number
  },
  data: () => ({
    tasksData: []
  }),
  watch: {
    tasksData: {
      deep: true,
      handler (val) {
        this.$emit('update:tasks', val)
      }
    },
    tasks: {
      deep: true,
      handler (val) {
        this.tasksData = val
      }
    }
  },
  mounted () {
    if (this.tasks) {
      this.tasksData = this.tasks
    }
  },
  methods: {
    removeTask (id) {
      this.tasksData = this.tasksData.filter(x => x.id !== id)
    },
    taskFocus (id, task) {
      this.$emit('taskFocus', id, task)
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss' as r;

.task {
  $task-height: 43.375px;

  &-enter-active, &-leave-active {
    transition: .3s r.$easing;
  }

  &-enter-from {
    transform: translateY($task-height);
    opacity: 0;
    height: 0;
  }

  &-enter-to {
    height: $task-height;
  }

  &-leave-from {
    height: $task-height;
  }

  &-leave-to {
    transform: translateY(-$task-height / 2);
    height: 0;
    padding: 0 !important;
    opacity: 0;
  }
}
</style>
