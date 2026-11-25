import { createRouter, createWebHistory } from "vue-router";
import useAuthStore from "@/store/auth.ts";
import useUserStore from "@/store/user.ts";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../views/auth/Login.vue"),
    },
    {
      path: "/panel",
      component: () => import("@/features/document/Layout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/admin/HomeView.vue"),
          meta: { requiresAuth: true, title: "Inicio" },
        },
        {
          path: "document/:slug",
          name: "document",
          component: () => import("../views/admin/DocumentEditorView.vue"),
          meta: { requiresAuth: true, title: "Editor de Documento" },
        },
        {
          path: "document/typst/:slug",
          alias: ["typst/:slug"],
          name: "document-typst",
          component: () => import("../views/admin/TypstEditorView.vue"),
          meta: { requiresAuth: true, title: "Editor Typst" },
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/admin/ProfileView.vue"),
          meta: { requiresAuth: true, title: "Mi Perfil" },
        },
      ],
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/Register.vue"),
    },
    {
      path: "/auth/2fa",
      name: "auth-two-factor-login",
      component: () => import("../views/auth/LoginTwoFactor.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("../views/auth/ForgotPassword.vue"),
    },
    {
      path: "/forgot-password/:token",
      name: "reset-password",
      component: () => import("../views/auth/ResetPassword.vue"),
    },
    {
      path: "/confirm/:token",
      name: "confirm-account",
      component: () => import("../views/auth/ConfirmAccount.vue"),
    },
    {
      path: "/generate-two-factor",
      name: "generate-two-factor",
      component: () => import("../views/auth/TwoFactor.vue"),
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
  ],
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.beforeEach(async (to, _) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!authStore.authenticated) {
    await authStore.getSession();
  }

  if (requiresAuth && !authStore.authenticated) {
    return { path: "/login" };
  }

  const profileIncomplete =
    authStore.authenticated && authStore.authData?.fullProfile === false;

  if (
    authStore.authenticated &&
    (to.name === "login" ||
      to.name === "register" ||
      to.name === "auth-two-factor-login")
  ) {
    return {
      name: profileIncomplete ? "profile" : "home",
    };
  }

  if (authStore.authenticated && authStore.authData?.fullProfile) {
    await userStore.getUser();
  }

  if (profileIncomplete && to.name !== "profile") {
    return { name: "profile" };
  }
});

export default router;
