<script lang="ts">
import axios from "axios";
import { AxiosResponse } from "axios";
import { reactive, onMounted, defineComponent } from "vue";

export default defineComponent({
  props: {
    api: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const data = reactive({
      json: null,
      loading: true,
    });

    onMounted(async () => {
      await axios
        .get(`${props.api}`, { params: { per_page: 50 } })
        .then((response: AxiosResponse) => {
          data.loading = false;
          data.json = response.data.data.data;
        });
    });

    return () =>
      slots.default({
        json: data.json,
        loading: data.loading,
      });
  },
});
</script>
