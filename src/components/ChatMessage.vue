<template>
   <div>
     [{{message.timestamp}}] <b>{{message.user}}: </b> {{message.message}}
   </div>
</template>

<script>
export default {
  props: ['message'],
  data: () => ({}),
  methods: {}
}
</script>
