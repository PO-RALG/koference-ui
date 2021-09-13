import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const documentCategoryRoutes = [
  {
    path: "/document-categories",
    component: () => import(/* webpackChunkName: "DocumentCategory" */ "../DocumentCategory.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Document Categories",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default documentCategoryRoutes;
