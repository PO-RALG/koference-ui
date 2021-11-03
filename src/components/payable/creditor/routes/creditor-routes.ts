import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const creditorRoutes = [
  {
    path: "/creditors",
    component: () => import("../Creditor.vue"),
    meta: {
      requiresAuth: true,
      title: "Creditors",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default creditorRoutes;
