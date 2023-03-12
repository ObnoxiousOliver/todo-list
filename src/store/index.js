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
      var bounds = store.state.config.bounds ?? {}

      const isIn = (val, min, max) => min < val && val < max

      if (ipcRenderer.sendSync('getAllDisplays').some(display => {
        var db = display.workArea
        var ret = isIn(bounds.x, db.x, db.x + db.width) && isIn(bounds.y, db.y, db.y + db.height)
        console.log(ret)
        return ret
      })) {
        if (bounds) {
          ipcRenderer.send('setBounds', {
            width: bounds.width,
            height: bounds.height,
            x: bounds.x,
            y: bounds.y
          })
        }
      } else {
        ipcRenderer.send('setBounds', { width: 0, height: 0, x: 0, y: 0 })
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
        var json = fs.readFileSync(CONFIG_JSON, { encoding: 'utf-8' })
        try {
          var data = JSON.parse(json)
          store.commit('setConfig', data)
        } catch {}
      }
    },
    setConfigEntry (store, payload) {
      var config = store.state.config

      Object.keys(payload).forEach(x => {
        config[x] = payload[x]
      })

      // console.log(payload)

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
