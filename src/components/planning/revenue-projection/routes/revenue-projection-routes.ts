import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const revenueProjectionRoutes = [
  {
    path: "/revenue-projections",
    component: () => import( "../RevenueProjection.vue"),
    meta: {
      requiresAuth: true,
      title: "Revenue Projections",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default revenueProjectionRoutes;
