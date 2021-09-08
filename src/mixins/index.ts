import store from "@/store";
import _ from "lodash";

export const helpers = {
  can(action: string, resource: string): boolean {
    resource = resource.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
    const user = store.getters["Auth/getCurrentUser"];
    const permissions = user.permissions;
    if (user) {
      return _.find(permissions, {
        action: action.toUpperCase(),
        resource: resource,
      })
        ? true
        : false;
    } else {
      return false;
    }
  },
};
