import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const approvalCouncilRoutes = [
  {
    path: "/manage-approval-council",
    component: () =>
      import(
        /* webpackChunkName: "ApprovalCouncil" */ "../ApprovalCouncil.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Approcal Council",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default approvalCouncilRoutes;
