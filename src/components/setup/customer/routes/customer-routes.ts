import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const customersRoutes = [
  {
    path: "/manage-customers",
    component: () => import(/* webpackChunkName: "Customer" */ "../Customer.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Customers",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default customersRoutes;
