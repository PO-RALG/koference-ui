import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const roleRoutes = [
  {
    path: "/manage-roles",
    component: () => import(/* webpackChunkName: "Role" */ "../Role.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Role",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
  {
    path: "/manage-roles/:id/add-permissions",
    name: "/manage-roles/:id/add-permissions",
    component: () => import(/* webpackChunkName: "Role" */ "../RolePermission.vue"),
    meta: {
      requiresAuth: true,
      title: "Add Role Permissions",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
    props: true,
  },
];

export default roleRoutes;
