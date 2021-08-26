// import Vue from "vue";
// import store from "../store";
// import _ from "lodash";
// Vue.mixin({
//   methods: {
//     can(action, resource) {
//       resource = resource.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
//       const user = store.getters.getCurrentUser;
//       const permissions = user.authorities;
//       if (user) {
//         return _.find(permissions, {
//           action: action.toUpperCase(),
//           resource: resource,
//         })
//           ? true
//           : false;
//       } else {
//         console.log("no current user");
//       }
//     },
//   },
// });
