<template>
  <v-row justify="center">
    <v-dialog v-model="isOpen" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">DELETING DATA</v-card-title>
        <v-card-text>Are you sure you want to delete this?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="isOpen = false">NO</v-btn>
          <v-btn color="green darken-1" text @click="deleteItem">YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: ['isOpen'],
  data () {
    return {
    }
  },
  methods: {
    deleteItem() {
      this.$emit('deleteItem')
      this.$emit('closeDeleteDialog')
    }
  }
}
</script>
