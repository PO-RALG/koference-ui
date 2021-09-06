const ProjectRoutes = [
  {
    path: "/manage-project",
    component: () => import("../Project.vue"),
    meta: { requiresAuth: false, title: "Manage Projects" },
  },
];

export default ProjectRoutes;
