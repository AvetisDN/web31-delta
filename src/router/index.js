import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

const routes = [
  {
    path: "/landing",
    name: "landing",
    component: () => import("../views/Landing.vue"),
    meta: {
      needsAuth: false,
    },
  },
  {
    path: "/",
    name: "main",
    component: () => import("../views/Layout.vue"),
    meta: {
      needsAuth: true,
    },
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/Home.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "explore",
        name: "explore",
        component: () => import("../views/Explore.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "notifications",
        name: "notifications",
        component: () => import("../views/Notifications.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "messages",
        name: "messages",
        component: () => import("../views/Messages.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "bookmarks",
        name: "bookmarks",
        component: () => import("../views/Bookmarks.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "lists",
        name: "lists",
        component: () => import("../views/Lists.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("../views/Profile.vue"),
        meta: {
          needsAuth: true,
        },
        children: [
          {
            path: "",
            name: "profile",
            component: () => import("../views/Profile.vue"),
            meta: {
              needsAuth: true,
            },
          },
          {
            path: "replies",
            name: "replies",
            component: () => import("../views/Profile.vue"),
            meta: {
              needsAuth: true,
            },
          },
          {
            path: "media",
            name: "media",
            component: () => import("../views/Profile.vue"),
            meta: {
              needsAuth: true,
            },
          },
          {
            path: "likes",
            name: "likes",
            component: () => import("../views/Profile.vue"),
            meta: {
              needsAuth: true,
            },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.needsAuth) {
    if (userStore.user) {
      return next();
    } else {
      return next("/landing");
    }
  }
  return next();
});

export default router;
