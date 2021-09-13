import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const adminAreaRoutes = [
  {
    path: "/admin-areas",
    component: () => import(/* webpackChunkName: "AdminArea" */ "../AdminArea.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Admin Areas",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default adminAreaRoutes;
