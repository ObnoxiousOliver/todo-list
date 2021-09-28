import { ipcRenderer } from 'electron'
import fs from 'fs'
import path from 'path'
import { createStore } from 'vuex'

const USER_DATA = ipcRenderer.sendSync('userDataPath')
const CONFIG_DIR = path.join(USER_DATA, 'Config')
const CONFIG_JSON = path.join(CONFIG_DIR, 'config.json')

export default createStore({
  state: {
    config: {
      theme: 'light',
      bounds: null
    },
    paths: {
      USER_DATA,
      CONFIG_DIR,
      CONFIG_JSON
    }
  },
  mutations: {
    toggleDark (state) {
      state.dark = !state.dark
    },
    setConfig (state, payload) {
      state.config = payload
    }
  },
  actions: {
    appStart (store) {
      store.dispatch('updateConfig')

      if (store.state.config.bounds) {
        ipcRenderer.send('setBounds', {
          width: store.state.config.bounds.width,
          height: store.state.config.bounds.height,
          x: store.state.config.bounds.x,
          y: store.state.config.bounds.y
        })
      }

      ipcRenderer.send('bounds')
      ipcRenderer.on('bounds:update', (e, bounds) => {
        store.dispatch('setConfigEntry', { bounds })
      })

      if (store.state.config.lockWindow) {
        ipcRenderer.send('lockWindow', store.state.config.lockWindow)
      }
    },
    updateConfig (store) {
      if (fs.existsSync(CONFIG_JSON)) {
        var data = fs.readFileSync(CONFIG_JSON, { encoding: 'utf-8' })

        store.commit('setConfig', JSON.parse(data))
      }
    },
    setConfigEntry (store, payload) {
      var config = store.state.config

      Object.keys(payload).forEach(x => {
        config[x] = payload[x]
      })

      // console.log(config)

      if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true })
      }

      fs.writeFile(CONFIG_JSON, JSON.stringify(config, null, 2), (err) => {
        if (err) console.error(err)
      })

      store.commit('setConfig', config)
    }
  }
})
