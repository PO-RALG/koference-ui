import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const projectRoutes = [
  {
    path: "/manage-projects",
    component: () => import(/* webpackChunkName: "Project" */ "../Project.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Projects",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default projectRoutes;
