import Vue from 'vue'
import Vuex from 'vuex'
// import socketService from './services/socketService'
import apiService from './services/apiService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentRoom: {
      name: null,
      users: []
    },
    rooms: {},
    userName: null,
    messages: [{
      user: 'Mathias',
      timestamp: '11:30:00',
      message: 'Hello world'
    },
    {
      user: 'Alex',
      timestamp: '03:45:00',
      message: 'Hello bunnies'
    },
    {
      user: 'Jelle',
      timestamp: '07:30:00',
      message: 'Hello onderdanen'
    }]
  },
  mutations: {
    setCurrentRoom (state, room) {
      if (room == null) {
        state.currentRoom = {
          name: null,
          users: []
        }
        return
      }
      state.currentRoom = room
    },
    setRooms (state, rooms) {
      state.rooms = rooms
    },
    addUserToCurrentRoom (state, user) {
      if (state.currentRoom != null) {
        state.currentRoom.users.push(user)
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
    },
    sendMessage (state, message) {
      console.log('Adding message to messages')
      state.messages.push(message)
    }
  },
  actions: {
    setCurrentRoom: (context, room) => {
      if (room != null) {
        // socketService.emit('joinRoom', { room, user: "alex" })
        apiService.getRoom(room).then(response => {
          context.commit('setCurrentRoom', {
            name: room,
            ...response.data
          })
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
    sendMessage: (context, message) => {
      context.commit('sendMessage', message)
    },
    SOCKET_userJoined: (context, data) => {
      context.commit('addUserToCurrentRoom', data.user)
    },
    SOCKET_userLeft: (context, data) => {
      context.commit('removeUserFromCurrentRoom', data.user)
    },
    SOCKET_msg: (context, data) => {
      // console.log('msg from socket received')
      // console.log(data)
      context.commit('sendMessage', message)
    }
  },
  getters: {
    currentRoom: state => state.currentRoom,
    rooms: state => state.rooms,
    currentPeers: state => state.currentPeers, // Doesn't exist?
    userName: state => state.userName,
    messages: state => state.messages
  }
})
