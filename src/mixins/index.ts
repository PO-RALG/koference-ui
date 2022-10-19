import Vue from "vue";
import store from "@/store";
import _ from "lodash";

Vue.mixin({
  methods: {
    can(action: string, resource: string): boolean {
      const user = store.getters["Auth/getCurrentUser"];

      const found = _.find(user.permissions, {
        action,
        resource,
      });

      if (user) {
        return !!found;
      }
    },

    cant(action: string, resource: string): boolean {
      const user = store.getters["Auth/getCurrentUser"];
      const found = _.find(user.permissions, {
        action,
        resource,
      });

      if (user) {
        const result = !!found;
        return !result;
      }
    },

    isDemo(): boolean {
      const site = store.getters["Auth/getSiteName"];
      return (site && site.name === "demo") ? true : false;
    },
  },
});
