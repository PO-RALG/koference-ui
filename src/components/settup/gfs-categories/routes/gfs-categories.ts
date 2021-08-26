const gfsCategoriesRoutes = [
  {
    path: "/gfs-categories",
    component: () => import("../Gfs-Categories.vue"),
    meta: { requiresAuth: false, title: "Gfs Categories" },
  },
];

export default gfsCategoriesRoutes;
