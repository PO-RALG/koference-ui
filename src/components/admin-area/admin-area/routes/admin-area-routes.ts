const adminAreaRoutes = [
  {
    path: "/admin-areas",
    component: () => import("../AdminArea.vue"),
    meta: { requiresAuth: false, title: "Admin Area" },
  },
];

export default adminAreaRoutes;
