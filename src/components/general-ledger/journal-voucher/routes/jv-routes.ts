import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const jvRoutes = [
  {
    path: "/journal-vouchers",
    component: () => import(/* webpackChunkName: "JournalVoucher" */ "../JournalVoucher.vue"),
    meta: {
      requiresAuth: true,
      title: "Journal Vouchers",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default jvRoutes;
