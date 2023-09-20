import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const queryDocumentTypeRoutes = [
  {
    path: "/query-document-type",
    component: () =>
      import(
        /* webpackChunkName: "QueryDocumentType" */ "../QueryDocumentType.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Query Document Type",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default queryDocumentTypeRoutes;
