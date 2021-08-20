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
        title: "Fund Sources",
        state: "/fund-sources",
      },
      {
        icon: "mdi-view-stream-outline",
        title: "GFS Codes",
        state: "/gfs-codes",
      },

      {
        icon: "mdi-text-subject",
        title: "Financial Years",
        state: "/financial-years",
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
        state: "/sub-budgets",
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
        title: "Manage Locations",
        state: "/manage-locations",
      },
      {
        icon: "mdi-border-left-variant",
        title: "Levels",
        state: "/manage-levels",
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
        icon: "mdi-key",
        title: "Manage Permissions",
        state: "/manage-permissions",
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
