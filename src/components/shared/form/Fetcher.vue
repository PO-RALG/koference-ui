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
    params: {
      type: Object,
      required: false,
    },
  },
  setup(props, { slots }) {
    const _params = props.params ? props.params : { per_page: 50 };
    const data = reactive({
      json: null,
      loading: true,
    });

    onMounted(async () => {
      await axios
        .get(`${props.api}`, { params: _params })
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
