<script setup lang="ts">
import { onMounted } from "vue";
import { useProjectStore } from "../stores/projectStore";

const projectStore = useProjectStore();

onMounted(async () => {
  console.log("🔄 Cargando proyectos...");
  await projectStore.fetchProjects();
  console.log("✅ Proyectos cargados:", projectStore.projects);
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-slate-900 mb-4">Dashboard</h1>

    <div v-if="projectStore.loading" class="text-slate-600">
      Cargando proyectos...
    </div>

    <div v-else-if="projectStore.error" class="text-red-600">
      Error: {{ projectStore.error }}
    </div>

    <div v-else-if="projectStore.projects.length === 0" class="text-slate-600">
      No tienes proyectos todavía. ¡Crea uno!
    </div>

    <div v-else>
      <h2 class="text-xl font-semibold text-slate-800 mb-3">Tus proyectos:</h2>
      <ul class="space-y-2">
        <li
          v-for="project in projectStore.projects"
          :key="project.id"
          class="p-4 bg-white rounded-lg shadow"
        >
          <h3 class="font-semibold text-slate-900">{{ project.name }}</h3>
          <p v-if="project.description" class="text-sm text-slate-600">
            {{ project.description }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
