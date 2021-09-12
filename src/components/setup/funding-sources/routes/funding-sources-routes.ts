import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const fundingSourceRoutes = [
  {
    path: "/manage-funding-sources",
    component: () => import(/* webpackChunkName: "FundingSource" */ "../FundingSource.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Funding Sources",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default fundingSourceRoutes;
