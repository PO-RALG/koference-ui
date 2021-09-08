const CustomersRoutes = [
  {
    path: "/manage-customers",
    component: () => import("../Customer.vue"),
    meta: { requiresAuth: false, title: "Manage Customers" },
  },
];

export default CustomersRoutes;
