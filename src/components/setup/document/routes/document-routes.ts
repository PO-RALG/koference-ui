import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const DocumentRoutes = [
  {
    path: "/manage-documents",
    component: () => import(/* webpackChunkName: "Document" */ "../Document.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Documents",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default DocumentRoutes;
