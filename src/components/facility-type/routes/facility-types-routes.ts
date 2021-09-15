import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const facilityTypeRoutes = [
  {
    path: "/manage-facility-types",
    component: () => import(/* webpackChunkName: "FacilityType" */ "../FacilityType.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Facility Types",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default facilityTypeRoutes;
