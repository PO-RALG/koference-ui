import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const jvRoutes = [
  {
    path: "/manage-journal-vouchers",
    component: () => import(/* webpackChunkName: "JournalVoucher" */ "../JournalVoucher.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Journal Vouchers",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default jvRoutes;
