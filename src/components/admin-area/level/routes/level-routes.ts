const levelRoutes = [
  {
    path: "/admin-area-levels",
    component: () => import("../LevelComponent.vue"),
    meta: { requiresAuth: false, title: "Admin Area Levels" },
  },
];

export default levelRoutes;
