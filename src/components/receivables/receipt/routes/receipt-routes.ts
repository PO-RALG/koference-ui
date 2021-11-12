import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const receiptRoutes = [
  {
    path: "/manage-receipts",
    component: () => import(/* webpackChunkName: "Receipt" */ "../Receipt.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Receipt",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default receiptRoutes;
