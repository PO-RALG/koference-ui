import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const facilityRoutes = [
  {
    path: "/manage-facilities",
    component: () => import("../Facility.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Facilities",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
  {
    path: "/manage-facilities/view",
    component: () => import("../FacilityView.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Facility",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default facilityRoutes;
