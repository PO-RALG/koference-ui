const FacilityRoutes = [
  {
    path: "/manage-facilities",
    component: () => import("../Facility.vue"),
    meta: { requiresAuth: false, title: "Manage Facility " },
  },
];

export default FacilityRoutes;
