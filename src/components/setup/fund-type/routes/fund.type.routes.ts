import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const fundTypesRoutes = [
  {
    path: "/manage-fund-types",
    component: () => import(/* webpackChunkName: "FundTypes" */ "../FundTypes.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Fund Types",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default fundTypesRoutes;
