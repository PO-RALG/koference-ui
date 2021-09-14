import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const activityCostingRoutes = [
  {
    path: "/activity-costing",
    component: () => import( "../ActivityCosting.vue"),
    meta: {
      requiresAuth: true,
      title: "Activity Costings",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default activityCostingRoutes;
