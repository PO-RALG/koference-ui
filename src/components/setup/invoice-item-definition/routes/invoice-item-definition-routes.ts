import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const invoiceItemDefinitionRoutes = [
  {
    path: "/manage-invoice-item-definition",
    component: () =>
      import(/* webpackChunkName: "Customer" */ "../InvoiceItemDefinition.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Invoice Item Definition",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default invoiceItemDefinitionRoutes;
