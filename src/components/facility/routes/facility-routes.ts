const facilityRoutes = [
  {
    path: "/manage-facilities",
    component: () => import("../Facility.vue"),
    meta: { requiresAuth: false, title: "Manage Facilities " },
  },
];

export default facilityRoutes;
