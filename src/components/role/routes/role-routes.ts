const roleRoutes = [
  {
    path: "/manage-roles",
    component: () => import("../Role.vue"),
    meta: { requiresAuth: true, title: "Manage Roles" },
  },
  {
    path: "/manage-roles/:id/add-permissions",
    name: "/manage-roles/:id/add-permissions",
    component: () => import("../RolePermission.vue"),
    meta: { requiresAuth: true, title: "Add Permissions" },
    props: true,
  },
];

export default roleRoutes;
