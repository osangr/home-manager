import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import ProjectsDetailView from "../views/ProjectsDetailView.vue";
import SpacesView from "../views/SpacesView.vue";
import TasksView from "../views/TasksView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      path: "/project/:id/spaces",
      name: "projects-spaces",
      component: SpacesView,
    },
    {
      path: "/project/:id/tasks",
      name: "projects-tasks",
      component: TasksView,
    },
    {
      path: "/components",
      name: "components",
      component: () => import("../views/ComponentsView.vue"),
    },
  ],
});

export default router;
