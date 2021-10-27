import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const reportRoutes = [
  {
    path: "/reports",
    component: () => import(/* webpackChunkName: "Report" */ "../Report.vue"),
    children: [
      {
        path: ":id",
        component: () => import("../ReportDetail.vue"),
      },
    ],
    meta: {
      requiresAuth: true,
      title: "View Reports",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default reportRoutes;
