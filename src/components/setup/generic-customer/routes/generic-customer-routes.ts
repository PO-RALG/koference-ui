import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const genericCustomerYearRoutes = [
  {
    path: "/manage-generic-customers",
    component: () =>
      import(
        /* webpackChunkName: "GnenericCustomer" */ "../GenericCustomer.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Manage Generic customer",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default genericCustomerYearRoutes;
