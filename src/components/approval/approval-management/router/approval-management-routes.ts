
import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const approvalMgtRoutes = [
  {
    path: "/approval-roles",
    component: () => import(/* webpackChunkName: "Approval" */ "../Approval.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Approval Roles",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default approvalMgtRoutes;
