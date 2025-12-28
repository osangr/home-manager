<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import ProjectCard from "@/components/features/projects/ProjectCard.vue";

const projectStore = useProjectStore();
const router = useRouter();

onMounted(async () => {
  await projectStore.fetchProjects();
});

const handleView = (id: string) => {
  router.push(`/project/${id}`);
};

const handleSpaces = (id: string) => {
  router.push(`/project/${id}/spaces`);
};

const handleTasks = (id: string) => {
  router.push(`/project/${id}/tasks`);
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-semibold mb-3">Dashboard</h1>
    <div v-if="projectStore.loading">Cargando proyectos...</div>
    <div v-else-if="projectStore.projects.length === 0">
      No tienes proyectos todavía.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCard
        v-for="project in projectStore.projects"
        :key="project.id"
        :project="project"
        :spaces-count="5"
        :tasks-count="15"
        :completed-tasks="9"
        @view="handleView"
        @spaces="handleSpaces"
        @tasks="handleTasks"
      />
    </div>
  </div>
</template>
