import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import contextmenu from 'vue3-contextmenu'

createApp(App)
  .use(store)
  .use(router)
  .use(contextmenu)
  .mount('#app')
