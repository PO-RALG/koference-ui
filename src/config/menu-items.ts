export const MENU_ITEMS = [
  {
    icon: "mdi-home",
    title: "Dashboard",
    state: "/",
  },
  {
    "icon-alt": "mdi-account-multiple-outline",
    icon: "mdi-attach_money",
    state: "/cash-management",
    title: "Cash Management",
    children: [
      {
        icon: "mdi-account-outline",
        title: "Fund Source Adjustment",
        state: "/fund-source-adjustment",
      },
      {
        icon: "mdi-home-floor-a",
        title: "Cash Book Report",
        state: "/cash-book-report",
      },
    ],
  },

  {
    icon: "mdi-cog",
    "icon-alt": "mdi-cog",
    title: "Settings",
    children: [
      {
        icon: "mdi-book-variant",
        title: "Financial Years",
        state: "/manage-financial-years",
      },

      {
        icon: "mdi-book-variant",
        title: "Document Categories",
        state: "/manage-document-categories",
      },
      {
        icon: "mdi-view-stream-outline",
        title: "Fund Types",
        state: "/manage-fund-types",
      },
      {
        icon: "mdi-view-stream-outline",
        title: "Bank Accounts",
        state: "/manage-bank-accounts",
      },
      // {
      //   icon: "mdi-text-subject",
      //   title: "Transaction Types",
      //   state: "/transaction-types",
      // },
      {
        icon: "mdi-view-stream-outline",
        title: "Facility Types",
        state: "/manage-facility-types",
      },
    ],
  },
  {
    "icon-alt": "mdi-chevron-up",
    icon: "mdi-chevron-down",
    title: "COA Segments",
    children: [
      {
        icon: "mdi-border-left-variant",
        title: "Sub Budget Class",
        state: "/manage-sub-budget-classes",
      },
      {
        icon: "mdi-border-left-variant",
        title: "GFS Categories",
        state: "/gfs-categories",
      },
      {
        icon: "mdi-border-left-variant",
        title: "GFS Codes",
        state: "/gfs-codes",
      },
      {
        icon: "mdi-border-left-variant",
        title: "Projects",
        state: "/manage-project",
      },
      {
        icon: "mdi-border-left-variant",
        title: "Funding Sources",
        state: "/manage-funding-sources",
      },
    ],
  },
  {
    "icon-alt": "mdi-chevron-up",
    icon: "mdi-chevron-down",
    title: "Admin Hierarchy",
    children: [
      {
        icon: "mdi-border-left-variant",
        title: "Manage Admin Areas",
        state: "/admin-areas",
      },
      {
        icon: "mdi-border-left-variant",
        title: "Levels",
        state: "/admin-area-levels",
      },
    ],
  },
  {
    "icon-alt": "mdi-chevron-up",
    icon: "mdi-chevron-down",
    title: "Roles & Permissions",
    children: [
      {
        icon: "mdi-account-cog",
        title: "Manage Roles",
        state: "/roles",
      },

      {
        icon: "mdi-animation-outline",
        title: "Menu Groups",
        state: "/manage-menu-groups",
      },
      {
        icon: "mdi-blur-linear",
        title: "Menu Items",
        state: "/menu-items",
      },
    ],
  },
  {
    "icon-alt": "mdi-chevron-up",
    icon: "mdi-account-circle",
    title: "Manage Users",
    state: "/manage-users",
  },
];
