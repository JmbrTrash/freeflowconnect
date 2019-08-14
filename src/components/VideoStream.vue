<template>
  <v-container>
    <v-layout text-center wrap>videostream of {{user.name}}</v-layout>
  </v-container>
</template>

<script>
import mapGetters from 'vuex'

export default {
  props: ['user'],
  data: () => ({}),
  computed: {
    ...mapGetters(['currentRoom'])
  },
  methods: {},
  mounted () {
    // console.log(this.$route);
  }
}
</script>
