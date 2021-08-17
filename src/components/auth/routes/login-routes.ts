const loginRoutes = [
  {
    path: "/login",
    component:() => import("../Login.vue"),
    meta: { requiresAuth: false, title: "Login" },
  },
];

export default loginRoutes;
