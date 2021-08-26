const levelRoutes = [
  {
    path: "/admin-area-levels",
    component: () => import("../Level.vue"),
    meta: { requiresAuth: false, title: "Admin Area Levels" },
  },
];

export default levelRoutes;
