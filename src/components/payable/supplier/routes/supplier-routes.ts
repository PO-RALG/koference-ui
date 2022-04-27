import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const supplierRoutes = [
  {
    path: "/manage-suppliers",
    component: () => import("../Supplier.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Suppliers",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default supplierRoutes;
