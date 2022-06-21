import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const approvalStatusRoutes = [
  {
    path: "/approval-statuses",
    component: () => import(/* webpackChunkName: "ApprovalStatus" */ "../ApprovalStatus.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Approval Statuses",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default approvalStatusRoutes;
