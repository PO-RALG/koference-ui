<template>
  <v-snackbar
    @click="dismiss"
    v-if="show"
    color="green darken-2"
    v-model="show"
    :title="true"
    :bottom="true"
    :right="false"
    :vertical="message.color !== 'success'"
    :multi-line="data.multiline"
    timeout="-1"
    class="white--text"
  >
    <v-row v-if="message.color === 'success'" @click="dismiss">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-icon>mdi-check-circle</v-icon>

        <span>
          {{ message.title }}
        </span>
      </v-col>
    </v-row>
    <v-row v-else @click="dismiss">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-icon>mdi-alert</v-icon>
        <span :class="message.class">
          {{ message.title }}
        </span>
        <ul v-if="typeof message.error === 'object'">
          <li
            v-for="(entry, index) in message.error"
            :key="index"
            :class="message.class"
          >
            {{ index + 1 }}{{ "." }} {{ entry }}
          </li>
        </ul>
        <ul v-else>
          <li :class="message.class">
            {{ message.error }}
          </li>
        </ul>
      </v-col>
    </v-row>
    <template v-slot:action="{ attrs }">
      <v-btn class="white--text" text v-bind="attrs" @click="dismiss"
        >Close</v-btn
      >
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("SnackBar");
import store from "@/store";

export default defineComponent({
  setup() {
    const { show, message } = useState(["show", "message"]);

    const data = reactive({
      timeout: 10000,
      vertical: false,
      multiline: true,
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
.v-application ul {
  padding-left: 0 !important;
}
</style>
