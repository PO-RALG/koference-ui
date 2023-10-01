<template>
  <v-row
    cols-lg="4"
    cols-md="12"
    cols-sm="12"
    align="center"
    class="d-flex justify-end align-center pagination-container"
  >
    <v-col lg="1" md="3" sm="3">Per Page</v-col>
    <v-col lg="1" md="3" sm="3" class="select-dropdown">
      <v-select
        @input="updateRowsPerPage($event)"
        :items="rows"
        v-model="data.selected"
        return-object
      >
      </v-select>
    </v-col>
    <v-col lg="1" md="3" sm="3" class="number-list">
      {{ params.from }}-{{ params.to }} of {{ params.total }}
    </v-col>
    <v-col lg="1" md="3" sm="3" class="prev-next-buttons">
      <v-row>
        <v-btn :disabled="isPrevBtnDisabled" @click.native="previousPage" icon>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn :disabled="isNextBtnDisabled" @click.native="nextPage" icon>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
export default defineComponent({
  props: {
    params: {
      type: Object,
      required: true,
    },
    onPageChange: {
      type: Function,
      required: false,
    },
    rows: {
      type: Array,
      required: false,
      default: () => ["5", "10", "15"],
    },
  },

  setup(props, { emit }) {
    let data = reactive({
      selected: props.rows[0],
    });

    const isPrevBtnDisabled = computed(() => {
      return props.params.current_page === 1;
    });

    const isNextBtnDisabled = computed(() => {
      return (
        props.params.current_page === props.params.total ||
        props.params.current_page === props.params.last_page
      );
    });

    const fetchData = (params: any) => {
      emit("onPageChange", params);
    };

    const nextPage = () => {
      let currentPage = props.params.current_page + 1;
      let params = {
        per_page: parseInt(props.params.per_page),
        page: parseInt(currentPage),
      };
      emit("onPageChange", params);
    };

    const previousPage = () => {
      let previousPage = props.params.current_page - 1;
      let params = {
        per_page: parseInt(props.params.per_page),
        page: previousPage,
      };
      emit("onPageChange", params);
    };

    const updateRowsPerPage = (value: any) => {
      let params = {
        per_page: parseInt(value),
        page: props.params.current_page,
      };
      emit("onPageChange", params);
    };

    return {
      data,

      // computed
      isNextBtnDisabled,
      isPrevBtnDisabled,

      // methods
      nextPage,
      previousPage,
      updateRowsPerPage,
      fetchData,
    };
  },
});
</script>

<style lang="scss" scoped>
.prev-next-buttons {
}
.select-dropdown {
}
.number-list {
}
.pagination-container {
  height: 74px;
  border-top: 1px solid #e0e0e0;
  margin: 0 !important;
}
</style>
