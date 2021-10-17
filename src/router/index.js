import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/reset-password/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard" }
      }
    ]
  },

  {
    path: "/clients",
    component: Layout,
    children: [
      {
        path: "",
        name: "Clients",
        component: () => import("@/views/clients/index"),
        meta: { title: "Clients", icon: "clients" }
      },
      {
        path: ":id",
        name: "ClientProfile",
        component: () => import("@/views/clients/profile/index"),
        hidden: true,
        props: true,
        meta: { title: "Client Profile" }
      },
      {
        path: ":id/create-new-transaction",
        name: "ClientCreateTransaction",
        component: () => import("@/views/clients/transactions/create"),
        hidden: true,
        props: true,
        meta: { title: "Create New Transaction" }
      }
    ]
  },

  {
    path: "/groups",
    component: Layout,
    children: [
      {
        path: "",
        name: "Groups",
        component: () => import("@/views/groups/index"),
        meta: { title: "Groups", icon: "groups" }
      },
      {
        path: ":id",
        name: "GroupProfile",
        component: () => import("@/views/groups/profile/index"),
        hidden: true,
        props: true,
        meta: { title: "Group Profile" }
      },
      {
        path: ":id/create-new-transaction",
        name: "GroupCreateTransaction",
        component: () => import("@/views/groups/transactions/create"),
        hidden: true,
        props: true,
        meta: { title: "Create New Transaction" }
      }
    ]
  },

  {
    path: "/services",
    component: Layout,
    children: [
      {
        path: "",
        name: "Services",
        component: () => import("@/views/services/index"),
        meta: { title: "Services", icon: "el-icon-setting" }
      },
      {
        path: "create",
        name: "ServicesAdd",
        component: () => import("@/views/services/services/add"),
        hidden: true,
        meta: { title: "Add New Service" }
      },
      {
        path: ":id/edit",
        name: "ServicesEdit",
        component: () => import("@/views/services/services/edit"),
        hidden: true,
        props: true,
        meta: { title: "Edit Service" }
      }
    ]
  },

  {
    path: "/documents",
    component: Layout,
    children: [
      {
        path: "",
        name: "Documents",
        component: () => import("@/views/documents/index"),
        meta: { title: "Documents", icon: "el-icon-document" }
      }
    ]
  },

  {
    path: "/accounts",
    component: Layout,
    children: [
      {
        path: "",
        name: "Accounts",
        component: () => import("@/views/accounts/index"),
        meta: { title: "Accounts", icon: "el-icon-s-custom" }
      },
      {
        path: "create",
        name: "AccountsAdd",
        component: () => import("@/views/accounts/add"),
        hidden: true,
        meta: { title: "Add New Account" }
      },
      {
        path: ":id/edit",
        name: "AccountsEdit",
        component: () => import("@/views/accounts/edit"),
        hidden: true,
        props: true,
        meta: { title: "Edit Account" }
      }
    ]
  },

  {
    path: "/profile",
    component: Layout,
    children: [
      {
        path: "",
        name: "Profile",
        component: () => import("@/views/profile/index"),
        meta: { title: "Profile", icon: "el-icon-user" }
      }
    ]
  },

  // {
  //   path: "/example",
  //   component: Layout,
  //   redirect: "/example/table",
  //   name: "Example",
  //   meta: { title: "Example", icon: "el-icon-s-help" },
  //   children: [
  //     {
  //       path: "table",
  //       name: "Table",
  //       component: () => import("@/views/table/index"),
  //       meta: { title: "Table", icon: "table" }
  //     },
  //     {
  //       path: "tree",
  //       name: "Tree",
  //       component: () => import("@/views/tree/index"),
  //       meta: { title: "Tree", icon: "tree" }
  //     }
  //   ]
  // },

  // {
  //   path: "/form",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "index",
  //       name: "Form",
  //       component: () => import("@/views/form/index"),
  //       meta: { title: "Form", icon: "form" }
  //     }
  //   ]
  // },

  // {
  //   path: "/nested",
  //   component: Layout,
  //   redirect: "/nested/menu1",
  //   name: "Nested",
  //   meta: {
  //     title: "Nested",
  //     icon: "nested"
  //   },
  //   children: [
  //     {
  //       path: "menu1",
  //       component: () => import("@/views/nested/menu1/index"), // Parent router-view
  //       name: "Menu1",
  //       meta: { title: "Menu1" },
  //       children: [
  //         {
  //           path: "menu1-1",
  //           component: () => import("@/views/nested/menu1/menu1-1"),
  //           name: "Menu1-1",
  //           meta: { title: "Menu1-1" }
  //         },
  //         {
  //           path: "menu1-2",
  //           component: () => import("@/views/nested/menu1/menu1-2"),
  //           name: "Menu1-2",
  //           meta: { title: "Menu1-2" },
  //           children: [
  //             {
  //               path: "menu1-2-1",
  //               component: () =>
  //                 import("@/views/nested/menu1/menu1-2/menu1-2-1"),
  //               name: "Menu1-2-1",
  //               meta: { title: "Menu1-2-1" }
  //             },
  //             {
  //               path: "menu1-2-2",
  //               component: () =>
  //                 import("@/views/nested/menu1/menu1-2/menu1-2-2"),
  //               name: "Menu1-2-2",
  //               meta: { title: "Menu1-2-2" }
  //             }
  //           ]
  //         },
  //         {
  //           path: "menu1-3",
  //           component: () => import("@/views/nested/menu1/menu1-3"),
  //           name: "Menu1-3",
  //           meta: { title: "Menu1-3" }
  //         }
  //       ]
  //     },
  //     {
  //       path: "menu2",
  //       component: () => import("@/views/nested/menu2/index"),
  //       name: "Menu2",
  //       meta: { title: "menu2" }
  //     }
  //   ]
  // },

  // {
  //   path: "external-link",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "https://panjiachen.github.io/vue-element-admin-site/#/",
  //       meta: { title: "External Link", icon: "link" }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
