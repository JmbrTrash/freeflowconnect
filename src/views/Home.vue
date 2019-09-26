<template>
  <v-row class="pa-4">
    <v-col md="8">
      <h1>Freeflowconnect</h1>
      <br />
      <p>Please enter a room name.</p>
      <v-text-field v-model="asperge" @keyup.enter="createRoom" autofocus></v-text-field>
      <v-btn id="hello" @click="createRoom">Create room</v-btn>
    </v-col>
  </v-row>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
      asperge: null
    }),
    computed: {},
    mounted () {
      this.setCurrentRoom(null)
    },
    methods: {
      ...mapActions(['setCurrentRoom', 'setRooms']),

      createRoom(events) {
        this.$router.push({
          name: "room", params: {roomName: this.asperge + "-" + Math.random().toString(36).substring(2, 15).toUpperCase() }
        })
      }
    }
  }
</script>
