import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const activityRoutes = [
  {
    path: "/manage-activities",
    component: () => import(/* webpackChunkName: "Activity" */ "../Activity.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Activities",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default activityRoutes;
