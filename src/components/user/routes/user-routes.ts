import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const userRoutes = [
  {
    path: "/manage-users",
    component: () => import(/* webpackChunkName: "User" */ "../User.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Users",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
  {
    path: "/approval-users",
    component: () => import(/* webpackChunkName: "User" */ "../User.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Approval Users",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default userRoutes;
