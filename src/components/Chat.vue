<template>
  <v-list-item >
    <v-list-item-title class="title text-capitalize">
      <ChatMessage />
    </v-list-item-title>
  </v-list-item>
</template>
<script>
import ChatMessage from './ChatMessage'
export default {
  components: {
    ChatMessage
  },
  data: () => ({}),
  methods: {}
};
</script>
