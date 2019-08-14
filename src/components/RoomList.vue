<template>
  <v-navigation-drawer mini-variant app permanent class="blue-grey darken-2 rounded" fixed dark>
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
          <v-list-item-title class="title text-capitalize">{{index}}</v-list-item-title>
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

export default {
  components: {
    CreateRoomDialog
  },
  data: () => ({
    // rooms: ["Wookie", "woo", "Ivan's cave"]
  }),
  computed: {
    ...mapGetters(['currentRoom', 'rooms', 'userName'])
  },
  methods: {
    ...mapActions(['setCurrentRoom']),
    changeRoom (room) {
      if (this.currentRoom.name !== null) {
        if (this.currentRoom.name !== room) {
          console.log('Leaving room: ', this.currentRoom.name)

          this.$socket.emit('leaveRoom', {
            room: this.currentRoom.name,
            user: this.userName
          })

          console.log('Joining room: ', room)

          this.$socket.emit('joinRoom', { room, user: this.userName })

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
