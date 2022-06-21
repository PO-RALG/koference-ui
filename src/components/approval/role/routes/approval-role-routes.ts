import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const approvalRoleRoutes = [
  {
    path: "/approval-roles",
    component: () => import(/* webpackChunkName: "ApprovalRole" */ "../ApprovalRole.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Approval Roles",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default approvalRoleRoutes;
