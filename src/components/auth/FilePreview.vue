<template>
  <Modal :modal="filePrevieModel" :fullScreen="true" :width="950">
    <template v-slot:header>
      <ModalHeader :title="`File Preview`" />
    </template>
    <template v-slot:body>
      <v-col cols="12" lg="12" md="12" sm="12"> </v-col>
      <ModalBody class="p-10">
        <v-card-text>
          <v-col sm="12">
            <iframe
              id="ManualFrame"
              width="100%"
              height="1200"
              allowtransparency="true"
              frameborder="0"
              style="
                max-width: 100% !important;
                max-height: 100% !important;
                margin: 0 auto !important;
                background-color: grey;
              "
              :src="toopen"
            ></iframe>
          </v-col>
        </v-card-text>
      </ModalBody>
    </template>
    <template v-slot:footer>
      <ModalFooter>
        <v-btn color="red darken-1" @click="closeFilePreview" text>Funga</v-btn>
      </ModalFooter>
    </template>
  </Modal>
</template>
<script>
import { onMounted, defineComponent, reactive } from "vue";

export default defineComponent({
  name: "FilePreview",
  props: {
    filePrevieModel: {
      type: Boolean,
    },
    toopen: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const data = reactive({});

    onMounted(() => {
      // initialize();
    });

    const closeFilePreview = () => {
      emit("closeFilePreview");
    };
    return {
      closeFilePreview,
    };
  },
});
</script>
