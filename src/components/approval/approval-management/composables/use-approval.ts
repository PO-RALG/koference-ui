import { reactive, onMounted } from "@vue/composition-api";

export const useApproval = (): Record<string, unknown> => {
  const data = reactive({
    title: "Manage Approval",
  });

  onMounted(() => {
    console.log("mounted hook");
  });

  return {
    data,
  };
};
