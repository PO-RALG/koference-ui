<template>
  <v-snackbar
    @click="dismiss"
    v-if="show"
    :color="message.color"
    v-model="show"
    :bottom="true"
    :right="true"
    timeout="-1"
  >
    <v-row v-if="message.color === 'success'" @click="dismiss">
      <v-col cols="12" sm="12" md="12" lg="12">
        <p class="message">
          {{ message.info }}
        </p>
      </v-col>
    </v-row>
    <v-row v-else @click="dismiss">
      <v-col cols="12" sm="12" md="12" lg="12">
        <p class="message">
          {{ message.message }}
        </p>
        <ul v-if="typeof message.info === 'object'">
          <li v-for="(entry, index) in message.info" :key="index">
            {{ entry }}
          </li>
        </ul>
        <ul v-else>
          <li>
            {{ message.info }}
          </li>
        </ul>
      </v-col>
    </v-row>
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="dismiss">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("SnackBar");
import store from "@/store";

export default defineComponent({
  setup() {
    let { show, message } = useState(["show", "message"]);

    let data = reactive({
      timeout: 100000,
    });

    const dismiss = () => {
      store.dispatch("SnackBar/HIDE");
    };

    return {
      data,
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

.v-sheet.v-snack__wrapper {
  border-radius: 0;
}
</style>
