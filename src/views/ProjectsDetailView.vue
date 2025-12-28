<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { computed, onMounted, ref } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { formatCurrency } from "@/utils/formatters";
import ProjectStatCard from "@/components/features/projects/ProjectStatCard.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import ProjectForm from "@/components/features/projects/ProjectForm.vue";
import type { CreateProject } from "@/types/database";

const route = useRoute();
const projectStore = useProjectStore();
const isUpdateOption = ref(false);
const isRemoveOption = ref(false);

const projectId = route.params.id as string;

onMounted(async () => {
  await projectStore.fetchProjectById(projectId);
});

const spacesCount = ref(5);
const tasksCount = ref(15);
const completedTasks = ref(9);

const project = computed(() => projectStore.currentProject);

const progressPercentage = computed(() => {
  if (tasksCount.value === 0) return 0;
  return Math.round((completedTasks.value / tasksCount.value) * 100);
});

const handleEdit = async (data: CreateProject) => {
  isUpdateOption.value = true;
  console.log("Editar proyecto:", data);

  await projectStore.updateProject(projectId, data);

  isUpdateOption.value = false;
};

const handleDelete = async () => {
  isRemoveOption.value = true;
  console.log("Eliminar proyecto:", projectId);
};
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
            @click="isUpdateOption = true"
          >
            Editar
          </BaseButton>
          <BaseButton
            size="small"
            variant="danger"
            @click="isRemoveOption = true"
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
      <BaseModal
        :is-open="isUpdateOption"
        title="Editar Proyecto"
        @close="isUpdateOption = false"
      >
        <ProjectForm
          :project="project"
          @cancel="isUpdateOption = false"
          @submit="handleEdit"
        />
      </BaseModal>

      <BaseModal
        :is-open="isRemoveOption"
        title="Eliminar Proyecto"
        size="small"
        @close="isRemoveOption = false"
      >
        <div class="p-4">
          <p class="mb-4">
            ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no
            se puede deshacer.
          </p>
          <div class="flex justify-end gap-2">
            <BaseButton variant="secondary" @click="isRemoveOption = false">
              Cancelar
            </BaseButton>
            <BaseButton variant="danger" @click="handleDelete">
              Eliminar
            </BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  </div>
</template>
