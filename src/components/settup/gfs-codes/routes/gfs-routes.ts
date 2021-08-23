const gfsCodesRoutes = [
  {
    path: "/gfs-codes",
    component: () => import("../routes/Gfs-Codes.vue"),
    meta: { requiresAuth: false, title: "Gfs Codes" },
  },
];

export default gfsCodesRoutes;
