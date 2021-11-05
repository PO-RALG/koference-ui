import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const chequeListRoutes = [
  {
    path: "/cheque-lists",
    component: () => import("../ChequeList.vue"),
    meta: {
      requiresAuth: true,
      title: "Cheque Lists",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default chequeListRoutes;
