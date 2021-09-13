import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const gfsCategoriesRoutes = [
  {
    path: "/gfs-categories",
    component: () => import(/* webpackChunkName: "GfsCategory" */ "../GfsCategory.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage GFS Categories",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default gfsCategoriesRoutes;
