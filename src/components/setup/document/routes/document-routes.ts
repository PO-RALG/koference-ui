const DocumentRoutes = [
  {
    path: "/manage-document",
    component: () => import("../Document.vue"),
    meta: { requiresAuth: false, title: "Manage Document" },
  },
];

export default DocumentRoutes;
