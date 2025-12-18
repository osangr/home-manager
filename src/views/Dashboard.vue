<script setup lang="ts">
import { onMounted } from "vue";
import { useProjectStore } from "../stores/projectStore";
import ProjectCard from "../components/features/projects/ProjectCard.vue";

const projectStore = useProjectStore();

onMounted(async () => {
  console.log("🔄 Cargando proyectos...");
  await projectStore.fetchProjects();
  console.log("✅ Proyectos cargados:", projectStore.projects);
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-slate-600 mb-6">Dashboard</h1>

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
        @view="(id) => console.log('Ver:', id)"
        @spaces="(id) => console.log('Espacios:', id)"
        @tasks="(id) => console.log('Tareas:', id)"
      />
    </div>
  </div>
</template>
