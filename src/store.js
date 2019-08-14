import Vue from 'vue'
import Vuex from 'vuex'
// import socketService from './services/socketService'
import apiService from './services/apiService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentRoom: null,
    rooms: {}
  },
  mutations: {
    setCurrentRoom (state, room) {
      state.currentRoom = room
    },
    setRooms (state, rooms) {
      state.rooms = rooms
    },
    addUserToCurrentRoom (state, user) {
      if (state.currentRoom != null) {
        console.log('adding user to current room', JSON.stringify(state.currentRoom), user)
        state.currentRoom.users[user] = 'e'

        console.log('Done adding user to current room', JSON.stringify(state.currentRoom))
      }
    }
  },
  actions: {
    setCurrentRoom: (context, room) => {
      if (room != null) {
        // socketService.emit('joinRoom', { room, user: "alex" })

        apiService.getRoom(room).then(response => {
          console.log('HERE: ', response.data)
          context.commit('setCurrentRoom', { name: room, ...response.data })
        })
      } else {
        context.commit('setCurrentRoom', room)
      }
    },
    setRooms: (context, rooms) => {
      context.commit('setRooms', rooms)
    },
    SOCKET_userJoined: (context, data) => {
      console.log(data)
      context.commit('addUserToCurrentRoom', data.user)
    }

  },
  getters: {
    currentRoom: state => state.currentRoom,
    rooms: state => state.rooms,
    currentPeers: state => state.currentPeers
  }
})
