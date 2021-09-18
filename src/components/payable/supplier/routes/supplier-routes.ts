import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const supplierRoutes = [
  {
    path: "/suppliers",
    component: () => import("../Supplier.vue"),
    meta: {
      requiresAuth: true,
      title: "Suppliers",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default supplierRoutes;
