import Vue from 'vue'
import Vuex from 'vuex'
// import socketService from './services/socketService'
import apiService from './services/apiService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentRoom: { name: null, users: [] },
    rooms: {},
    userName: null
  },
  mutations: {
    setCurrentRoom (state, room) {
      console.log('CURRENT ROOM SET', room)
      if (room == null) {
        state.currentRoom = { name: null, users: [] }
        return
      }
      state.currentRoom = room
    },
    setRooms (state, rooms) {
      state.rooms = rooms
    },
    addUserToCurrentRoom (state, user) {
      if (state.currentRoom != null) {
        console.log('adding user to current room', JSON.stringify(state.currentRoom), user)
        state.currentRoom.users.push(user)

        console.log('Done adding user to current room', JSON.stringify(state.currentRoom))
      }
    },
    removeUserFromCurrentRoom (state, user) {
      if (state.currentRoom != null) {
        console.log('Removing user from current room', JSON.stringify(state.currentRoom), user)
        state.currentRoom.users.splice(state.currentRoom.users.indexOf(user), 1)
        delete state.currentRoom.users.indexOf(user)

        console.log('Done removing user from current room', JSON.stringify(state.currentRoom))
      }
    },
    setUserName (state, userName) {
      state.userName = userName
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
    setUserName: (context, userName) => {
      context.commit('setUserName', userName)
    },
    SOCKET_userJoined: (context, data) => {
      console.log(data)
      context.commit('addUserToCurrentRoom', data.user)
    },
    SOCKET_userLeft: (context, data) => {
      console.log(data)
      context.commit('removeUserFromCurrentRoom', data.user)
    }

  },
  getters: {
    currentRoom: state => state.currentRoom,
    rooms: state => state.rooms,
    currentPeers: state => state.currentPeers,
    userName: state => state.userName
  }
})
