const FacilityTypeRoutes = [
  {
    path: "/manage-facility-types",
    component: () => import("../FacilityType.vue"),
    meta: { requiresAuth: false, title: "Manage Facility Type" },
  },
];

export default FacilityTypeRoutes;
