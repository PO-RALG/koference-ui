const menuRoutes = [
  {
    path: "/manage-menu-items",
    component: () => import("../MenuItem.vue"),
    meta: { requiresAuth: true, title: "Manage Menu Items" },
  },
  {
    path: "/manage-menu-groups",
    component: () => import("../MenuGroup.vue"),
    meta: { requiresAuth: true, title: "Manage Menu Groups" },
  },
  {
    path: "/manage-menu-items/:id/add-permissions",
    name: "/roles/:id/add-permissions",
    //component: () => import("../MenuItemPermission.vue"),
    meta: { requiresAuth: true, title: "Add Menu Item Permissions" },
    props: true,
  },
];

export default menuRoutes;
