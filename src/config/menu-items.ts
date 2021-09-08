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
    code: 5003,
    children: [
      {
        icon: "mdi-account-outline",
        title: "Fund Source Adjustment",
        state: "/fund-source-adjustment",
        code: 1069
        },
      {
        icon: "mdi-home-floor-a",
        title: "Cash Book Report",
        state: "/cash-book-report",
        code: 1036
      },
    ],
  },

  {
    icon: "mdi-cog",
    "icon-alt": "mdi-cog",
    title: "Settings",
    code: 5006,
    children: [
        // Please dont change or erase the codes
        // {
        //     icon: "mdi-book-variant",
        //     title: "Fund Sources",
        //     state: "/fund-sources",
        //     code: 1014
        //
        // },
        // {
        //     icon: "mdi-view-stream-outline",
        //     title: "Fund Types",
        //     state: "/fund-type",
        //     code: 1013
        //
        // },

      {
        icon: "mdi-book-variant",
        title: "Financial Years",
        state: "/manage-financial-years",
        code : 1046
      },

      {
        icon: "mdi-book-variant",
        title: "Document Categories",
        state: "/manage-document-categories",
        code: 1057
      },
      {
        icon: "mdi-view-stream-outline",
        title: "Fund Types",
        state: "/manage-fund-types",
          code: 1013

      },
      {
        icon: "mdi-view-stream-outline",
        title: "Bank Accounts",
        state: "/manage-bank-accounts",
        code:1053
      },
      // {
      //   icon: "mdi-text-subject",
      //   title: "Transaction Types",
      //   state: "/transaction-types",
//        code: 1030
// },

      {
        icon: "mdi-text-subject",
        title: "Facility Types",
        state: "/manage-facility-types",
        code: 1018

      },
    ],
  },
  {
    "icon-alt": "mdi-chevron-up",
    icon: "mdi-chevron-down",
    title: "COA Segments",
    code: 5004,
    children: [
      {
        icon: "mdi-border-left-variant",
        title: "Sub Budget Class",
        state: "/manage-sub-budget-classes",
        code: 1034
      },
      {
        icon: "mdi-border-left-variant",
        title: "GFS Categories",
        state: "/gfs-categories",
        code: 1071
      },
      {
        icon: "mdi-border-left-variant",
        title: "GFS Codes",
        state: "/gfs-codes",
        code:1045
      },
      {
        icon: "mdi-border-left-variant",
        title: "Projects",
        state: "/manage-project",
        code: 1027
      },
      {
        icon: "mdi-border-left-variant",
        title: "Funding Sources",
        state: "/manage-funding-sources",
        code: 1043
      },
    ],
  },
  {
    "icon-alt": "mdi-chevron-up",
    icon: "mdi-chevron-down",
    title: "Admin Hierarchy",
    code: 5011,
    children: [
      {
        icon: "mdi-border-left-variant",
        title: "Manage Admin Areas",
        state: "/admin-areas",
        code: 1072
      },
      {
        icon: "mdi-border-left-variant",
        title: "Levels",
        state: "/admin-area-levels",
        code: 1073
      },
    ],
  },
  {
    "icon-alt": "mdi-chevron-up",
    icon: "mdi-chevron-down",
    title: "Roles & Permissions",
    code: 5007,
    children: [
      {
        icon: "mdi-account-cog",
        title: "Manage Roles",
        code: 1023,
        state: "/roles"
      },
      {
        icon: "mdi-key",
        title: "Manage Permissions",
        state: "/manage-permissions",
        code: 1010
      },
      {
        icon: "mdi-animation-outline",
        title: "Menu Groups",
        state: "/manage-menu-groups",
        code: 1021
      },
      {
        icon: "mdi-blur-linear",
        title: "Menu Items",
        state: "/menu-items",
        code: 1022
      },
    ],
  },
  {
    "icon-alt": "mdi-chevron-up",
    icon: "mdi-account-circle",
    title: "Manage Users",
    state: "/manage-users",
    code: 1016
  },
];
