import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const reportFilterRoutes = [
  {
    path: "/manage-report-filters",
    component: () =>
      import(/* webpackChunkName: "ReportFilter" */ "../ReportFilter.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Report Filters",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default reportFilterRoutes;
