import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const queryCategoryRoutes = [
  {
    path: "/query-category",
    component: () =>
      import(/* webpackChunkName: "QueryCategory" */ "../QueryCategory.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Query Categories",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default queryCategoryRoutes;
