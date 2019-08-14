<template>
  <span>
    <!-- <h1>Welcome to FreeFlowConnect</h1> -->
    <iframe src="https://openly.live/" frameborder="0" width=100% height="99%"></iframe>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

// import apiService from './../services/apiService'

export default {
  data: () => ({}),
  computed: {},
  mounted () {
    this.setCurrentRoom(null)
  },
  methods: {
    ...mapActions(['setCurrentRoom', 'setRooms'])
  }
}
</script>
