import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const reportRoutes = [
  {
    path: "/reports",
    name: "reports",
    title: "Print Reports",
    component: () => import(/* webpackChunkName: "Report" */ "../Report.vue"),
    children: [
      {
        path: ":location_id",
        component: () => import("../ReportDetail.vue"),
        meta: {
          requiresAuth: true,
          title: "Report Details",
          middleware: [setTitle, validateToken, setHeaders, auth],
        },
      },
    ],
    meta: {
      requiresAuth: true,
      title: "View Reports",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
  {
    path: "/manage-reports",
    component: () => import(/* webpackChunkName: "NewReport" */ "../NewReport.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Reports",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default reportRoutes;
