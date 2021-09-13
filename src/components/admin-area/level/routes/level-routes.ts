import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const levelRoutes = [
  {
    path: "/admin-area-levels",
    component: () => import(/* webpackChunkName: "Level" */ "../Level.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Admin Area Levels",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default levelRoutes;
