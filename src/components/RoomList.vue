<template>
  <v-navigation-drawer app permanent class="blue-grey darken-2 rounded" fixed dark>
    <v-toolbar color="primary" class="py-3">
      <!-- <v-icon dark>home</v-icon> -->
      <v-avatar color="white" @click="goHome" style="cursor:pointer">
        <v-img lazy-src="/kitten.jpg">
          <template v-slot:placeholder>
            <v-icon color="blue-grey darken-2">fas fa-user-astronaut</v-icon>
          </template>
        </v-img>
        <!-- <v-icon color="blue-grey darken-2">fas fa-user-astronaut</v-icon> -->
      </v-avatar>
    </v-toolbar>

    <v-tooltip right v-for="(room, index) in rooms" :key="index">
      <template v-slot:activator="{ on }">
        <v-list-item link @click="changeRoom(index)" v-on="on">
          <v-list-item-title class="text">{{index}}</v-list-item-title>
        </v-list-item>
      </template>
      <span>{{index}}</span>
      <!-- <v-list-item-icon>
      </v-list-item-icon>-->
    </v-tooltip>
    <!-- <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-list-item link @click="createRoom" v-on="on">
          <i class="fas fa-plus"></i>
        </v-list-item>
      </template>
      <span>Create new room</span>
      <v-list-item-icon></v-list-item-icon>
    </v-tooltip> -->
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-list-item link v-on="on">
          <CreateRoomDialog />
        </v-list-item>
      </template>
      <span>Create new room</span>
    </v-tooltip>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CreateRoomDialog from './CreateRoomDialog'
import JanusWrapper from '../plugins/janus.videoroom'

export default {
  components: {
    CreateRoomDialog
  },
  data: () => ({
    // rooms: ["Wookie", "woo", "Ivan's cave"]
    janus: null
  }),
  computed: {
    ...mapGetters(['currentRoom', 'rooms', 'userName'])
  },
  methods: {
    ...mapActions(['setCurrentRoom']),
    changeRoom (room) {
      if (this.currentRoom.name == room) {
        console.log("Yeah, not happening... ")
        return
      }

      if (document.getElementById('myvideo') != null) {
        document.getElementById('myvideo').srcObject = null      
      }

      for (var i = 1; i <= 10; i++) {
        if (document.getElementById('participant' + i) != null) {
          document.getElementById('participant' + i).srcObject = null
        }
      }

      console.log('Changing room: ', this.currentRoom.name + ' to ' + room)

      this.janus = new JanusWrapper(this.currentRoom.name == null ? room : this.currentRoom.name)

      if (this.currentRoom.name !== null) {
        if (this.currentRoom.name !== room) {
          console.log('Leaving room: ', this.currentRoom.name)

          this.$socket.emit('leaveRoom', {
            room: this.currentRoom.name,
            user: this.userName
          })

          // this.janus.disconnect()

          console.log('Joining room: ', room)

          this.$socket.emit('joinRoom', { room, user: this.userName })

          // this.janus.connect(room)

          this.janus.switchRoom(room)
          this.setCurrentRoom(room)

          this.$router.push({ name: 'room', params: { roomName: room } })
        }
      } else {
        this.setCurrentRoom(room)

        // this.$socket.emit("joinRoom", { room, user: this.userName });

        this.$router.push({ name: 'room', params: { roomName: room } })
      }
    },
    createRoom () {
      console.log('create new room')
    },
    goHome () {
      if (this.$route.name !== 'home') {
        this.$socket.emit('leaveRoom', {
          room: this.currentRoom.name,
          user: this.userName
        })

        this.$router.push({ name: 'home' })
      }
    }
  },
  mounted () {}
}
</script>
