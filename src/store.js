import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentRoom: null
  },
  mutations: {
    setCurrentRoom: (room) => {
      // currentRoom = room
    }
  },
  actions: {

  }
})
