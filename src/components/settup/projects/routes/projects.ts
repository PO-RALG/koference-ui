const projectsRoutes = [
  {
    path: "/projects",
    component: () => import("../Projects.vue"),
    meta: { requiresAuth: false, title: "Projects" },
  },
];

export default projectsRoutes;
