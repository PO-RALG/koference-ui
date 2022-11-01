<template>
  <v-row justify="center">
    <v-dialog persistent v-model="filepreviewmodal" max-width="900">
      <v-card>
        <v-card-title class="headline">
          <span
            v-if="files.document_type"
            class="heading text-lowercase grey--text"
          >
            <v-icon class="small">mdi-paperclip</v-icon>
            <small>{{ files.document_type.name }}</small>
          </span>
          <v-spacer></v-spacer>
          <v-btn
            x-small
            class="d-flex d-sm-none"
            color="red"
            @click="closeModal()"
            text
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
          <v-btn
            class="d-none d-lg-flex d-xl-none"
            small
            color="red"
            text
            @click="closeModal()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- {{toopen}} -->
        <v-card-text>
          <v-col sm="12">
            <iframe
              id="ManualFrame"
              width="100%"
              height="600"
              allowtransparency="true"
              frameborder="0"
              style="max-width: 100% !important;max-height: 100% !important; margin: 0 auto !important;background-color: grey;"
              :src="toopen"
            ></iframe>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  components: {},
  props: ["filepreviewmodal", "files", "toopen"],
  data() {
    return {};
  },
  methods: {
    closeModal() {
      this.$emit("closeFilePreview");
    }
  },
  mounted() {}
};
</script>
