import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const customerRoutes = [
  {
    path: "/manage-generic-customers",
    component: () => import(/* webpackChunkName: "Customer" */ "../GenericCustomer.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Customers Template",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default customerRoutes;
