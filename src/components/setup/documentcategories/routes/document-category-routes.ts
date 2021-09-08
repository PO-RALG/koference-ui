const DocumentCategoryRoutes = [
  {
    path: "/manage-document-categories",
    component: () => import("../DocumentCategory.vue"),
    meta: { requiresAuth: false, title: "Manage Document Categories" },
  },
];

export default DocumentCategoryRoutes;
