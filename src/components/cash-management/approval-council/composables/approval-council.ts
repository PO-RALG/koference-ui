import { reactive, onMounted } from "vue";

export const useCouncilApproval = (): any => {
  const data = reactive({
    title: "Manage Council Approvals",
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {};

  return {
    data,
  };
};
