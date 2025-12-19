<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { computed, onMounted, ref } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { formatCurrency } from "@/utils/formatters";
import ProjectStatCard from "@/components/features/projects/ProjectStatCard.vue";

const route = useRoute();
const projectStore = useProjectStore();

const projectId = route.params.id as string;

onMounted(async () => {
  console.log("🔄 Cargando detalles del proyecto...");
  await projectStore.fetchProjectById(projectId);
  console.log(
    "✅ Detalles del proyecto cargados:",
    projectStore.currentProject
  );
});

const spacesCount = ref(5);
const tasksCount = ref(15);
const completedTasks = ref(9);

const project = computed(() => projectStore.currentProject);

const progressPercentage = computed(() => {
  if (tasksCount.value === 0) return 0;
  return Math.round((completedTasks.value / tasksCount.value) * 100);
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-slate-900 mb-8">Detalle del Proyecto</h1>

    <!-- Loading -->
    <div v-if="projectStore.loading" class="text-slate-600">
      Cargando proyecto...
    </div>

    <!-- Error -->
    <div v-else-if="!project" class="text-red-600">Proyecto no encontrado</div>

    <!-- Contenido -->
    <div v-else>
      <!-- Header proyecto -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">
            {{ project.name }}
          </h2>
          <p v-if="project.description" class="text-slate-600">
            {{ project.description }}
          </p>
        </div>

        <div class="flex gap-2">
          <BaseButton
            size="small"
            variant="secondary"
            @click="console.log('Editar:', project.id)"
          >
            Editar
          </BaseButton>
          <BaseButton
            size="small"
            variant="danger"
            @click="console.log('Eliminar:', project.id)"
          >
            Eliminar
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProjectStatCard
          icon="💰"
          label="Presupuesto"
          :value="formatCurrency(project.total_budget)"
        />

        <ProjectStatCard
          icon="📐"
          label="Espacios"
          :value="spacesCount"
          :to="`/project/${projectId}/spaces`"
        />

        <ProjectStatCard
          icon="📋"
          label="Tareas"
          :value="`${completedTasks} / ${tasksCount}`"
          :to="`/project/${projectId}/tasks`"
          :subtitle="`${progressPercentage}% completado`"
        />
      </div>
    </div>
  </div>
</template>
