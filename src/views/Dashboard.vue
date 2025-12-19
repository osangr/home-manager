<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import ProjectCard from "@/components/features/projects/ProjectCard.vue";

const projectStore = useProjectStore();
const router = useRouter();

onMounted(async () => {
  console.log("🔄 Cargando proyectos...");
  await projectStore.fetchProjects();
  console.log("✅ Proyectos cargados:", projectStore.projects);
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
    <!-- Resto del dashboard... -->
    <div v-if="projectStore.loading">Cargando proyectos...</div>
    <div v-else-if="projectStore.projects.length === 0">
      No tienes proyectos todavía.
    </div>
    <div v-else>
      <h2 class="text-xl font-semibold mb-3">Tus proyectos:</h2>
      <ProjectCard
        v-for="project in projectStore.projects"
        :key="project.id"
        :project="project"
        :spaces-count="5"
        :tasks-count="15"
        :completed-tasks="9"
        @view="(id) => handleView(id)"
        @spaces="(id) => handleSpaces(id)"
        @tasks="(id) => handleTasks(id)"
      />
    </div>
  </div>
</template>
