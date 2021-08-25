const adminAreaRoutes = [
  {
    path: "/admin-areas",
    component: () => import("../AdminAreaComponent.vue"),
    meta: { requiresAuth: false, title: "Admin Area" },
  },
];

export default adminAreaRoutes;
