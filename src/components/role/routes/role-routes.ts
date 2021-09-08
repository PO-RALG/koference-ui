const roleRoutes = [
  {
    path: "/roles",
    component: () => import("../Role.vue"),
    meta: { requiresAuth: true, title: "Manage Roles" },
  },
  {
    path: "/roles/:id/add-permissions",
    name: "/roles/:id/add-permissions",
    component: () => import("../RolePermission.vue"),
    meta: { requiresAuth: true, title: "Add Permissions" },
    props: true
  },
];

export default roleRoutes;
