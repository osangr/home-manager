import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import ProjectsDetailView from "@/views/ProjectsDetailView.vue";
import SpacesView from "@/views/SpacesView.vue";
import TasksView from "@/views/TasksView.vue";
import { useAuthStore } from "@/stores/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
    },
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/project/:id",
      name: "projects-details",
      component: ProjectsDetailView,
    },
    {
      path: "/project/:id/spaces/:spaceId/tasks",
      name: "projects-tasks",
      component: TasksView,
    },
    {
      path: "/project/:id/spaces",
      name: "projects-spaces",
      component: SpacesView,
    },
    {
      path: "/project/:id/tasks",
      name: "project-tasks",
      component: () => import("@/views/ProjectTaskView.vue"),
    },
    {
      path: "/components",
      name: "components",
      component: () => import("../views/ComponentsView.vue"),
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (authStore.loading) {
    await authStore.initialize();
  }

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(to.path);

  if (isPublicRoute && authStore.isAuthenticated) {
    return next("/");
  }

  if (!isPublicRoute && !authStore.isAuthenticated) {
    return next("/login");
  }

  next();
});

export default router;
