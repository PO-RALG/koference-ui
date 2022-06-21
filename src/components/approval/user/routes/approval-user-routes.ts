import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const approvalUserRoutes = [
  {
    path: "/manage-approval-users",
    component: () => import(/* webpackChunkName: "User" */ "../User.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Approval Users",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default approvalUserRoutes;
