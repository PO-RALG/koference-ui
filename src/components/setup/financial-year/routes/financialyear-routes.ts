import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const financialYearRoutes = [
  {
    path: "/manage-financial-years",
    component: () =>
      import(/* webpackChunkName: "FinancialYear" */ "../FinancialYear.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Financial Years",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default financialYearRoutes;
