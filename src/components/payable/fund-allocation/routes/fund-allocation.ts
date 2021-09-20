import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const fundAllocationRoutes = [
  {
    path: "/fund-allocations",
    component: () => import("../FundAllocation.vue"),
    meta: {
      requiresAuth: true,
      title: "Fund Allocations",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default fundAllocationRoutes;
