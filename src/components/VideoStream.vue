<template>
  <v-container>
    <!-- <v-layout text-center wrap>
      videostream of {{user.name}}
    </v-layout>-->
    <v-card
      class="mx-auto"
      :flat="flat"
      :loading="loading"
      :outlined="outlined"
      :elevation="elevation"
      :raised="raised"
      :width="width"
      :height="height"
    >
      <!-- <v-img
        v-if="media"
        class="white--text"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      > -->
      <!-- </v-img> -->
      <!-- <v-card-title v-else>I'm a title</v-card-title> -->

      <video v-if="user=='ikke'" id="ikke" :width="width" :height="height" autoplay></video>
      <video v-else id="denanderen" :width="width" :height="height" autoplay></video>
      <v-card-text>{{user}}</v-card-text>

    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['user'],
  data: () => ({
    flat: false,
    media: true,
    loading: false,
    actions: false,
    outlined: false,
    elevation: undefined,
    raised: false,
    width: 344,
    height: undefined
  }),
  computed: {
    ...mapGetters(['currentRoom'])
  },
  methods: {},
  mounted () {
    // console.log(this.$route);
  }
}
</script>
