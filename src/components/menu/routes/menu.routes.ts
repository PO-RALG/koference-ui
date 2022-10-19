import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const menuRoutes = [
  {
    path: "/manage-menu-items",
    component: () =>
      import(
        /* webpackChunkName: "MenuItem" */ "@/components/menu/MenuItem.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Manage Menu Items",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
  {
    path: "/manage-menu-groups",
    component: () => import(/* webpackChunkName: "MenuGroup" */ "../MenuGroup.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Menu Groups",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
  {
    path: "/manage-menu-items/:id/add-permissions",
    name: "/roles/:id/add-permissions",
    //component: () => import("../MenuItemPermission.vue"),
    meta: {
      requiresAuth: true,
      title: "Add Menu Item Permissions",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
    props: true,
  },
];

export default menuRoutes;
