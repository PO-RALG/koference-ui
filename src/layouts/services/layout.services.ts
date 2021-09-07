import store from "@/store";

const getCurrentUser = async () => {
  return await store.getters["Auth/getCurrentUser"];
};

export { getCurrentUser };
