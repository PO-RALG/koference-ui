import store from "@/store";

const getStatus = async () => {
  return await store.getters["Preloader/getLoaderStatus"];
};

export { getStatus };
