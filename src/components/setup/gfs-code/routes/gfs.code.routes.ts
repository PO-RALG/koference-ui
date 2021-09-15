import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const gfsCodesRoutes = [
  {
    path: "/manage-gfs-codes",
    component: () => import(/* webpackChunkName: "GfsCode" */ "../GfsCode.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage GFS Codes",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default gfsCodesRoutes;
