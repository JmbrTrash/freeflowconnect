<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="300px">
      <template v-slot:activator="{ on }">
        <div width=100% v-on="on">
          <i class="fas fa-plus"></i>
        </div>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create new room</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field label="Room name" v-model="roomName" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="createTeam">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    roomName: null
  }),
  methods: {
    createTeam () {
      console.log(this.roomName)
    }
  }
}
</script>
