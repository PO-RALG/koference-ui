import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const glReportRoutes = [
  {
    path: "/gl-statement-report",
    component: () => import(/* webpackChunkName: "GLReport" */ "../GLReport.vue"),
    meta: {
      requiresAuth: true,
      title: "General Ledger Statement Report",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default glReportRoutes;
