const roleRoutes = [
  {
    path: "/manage-roles",
    component: () => import("../Role.vue"),
    meta: { requiresAuth: false, title: "Manage Roles" },
  },
];

export default roleRoutes;
