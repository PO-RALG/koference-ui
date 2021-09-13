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
];

export default facilityRoutes;
