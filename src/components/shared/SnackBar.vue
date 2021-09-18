<template>
  <v-snackbar
    @click="dismiss"
    v-if="show"
    :color="message.color"
    v-model="show"
    :top="true"
    :right="true"
    timeout="-1"
    multiline
  >
    <v-row v-if="(message.color === 'success')" @click="dismiss">
      <v-col cols="12">
        <p class="message">
          {{ message.info }}
        </p>
      </v-col>
    </v-row>
    <v-row v-else @click="dismiss">
      <v-col cols="12">
        <p class="message">
          {{ message.message }}
        </p>
        <ul>
          <li v-for="(entry, index) in message.info" :key="index">
            {{ entry }}
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-snackbar>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("SnackBar");
import store from "@/store";

export default defineComponent({
  setup() {
    let { show, message } = useState(["show", "message"]);

    const dismiss = () => {
      store.dispatch("SnackBar/HIDE");
    };

    return {
      show,
      message,
      dismiss,
    };
  },
});
</script>

<style lang="scss" scoped>
p.message {
  margin-top: 0;
  margin-bottom: 5px;
  text-transform: uppercase;
}
ul {
  padding: 0;
  margin: 0;
  li {
    list-style-type: none;
    list-style: none;
  }
}
.v-application .error {
  border-bottom: 5px solid;
}
</style>
