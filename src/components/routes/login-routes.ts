const loginRoutes = [
  {
    path: "/login",
    component: () => import(/* webpackChunkName: "Login" */ "../Login.vue"),
    meta: { requiresAuth: false, title: "Login" },
  },
];

export default loginRoutes;
