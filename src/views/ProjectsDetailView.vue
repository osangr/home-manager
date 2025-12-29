<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useSpacesStore } from "@/stores/spaceStorage";
import { useTaskStore } from "@/stores/taskStore";
import { computed, onMounted } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { formatCurrency } from "@/utils/formatters";
import ProjectStatCard from "@/components/features/projects/ProjectStatCard.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import ProjectForm from "@/components/features/projects/ProjectForm.vue";
import type { CreateProject } from "@/types/database";
import { useModal } from "@/composables/useModal";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const spaceStore = useSpacesStore();
const taskStore = useTaskStore();
const editModal = useModal();
const deleteModal = useModal();

const projectId = route.params.id as string;

onMounted(async () => {
  await Promise.all([
    projectStore.fetchProjectById(projectId),
    spaceStore.fetchSpacesByProject(projectId),
    taskStore.fetchTasksByProject(projectId),
  ]);
});

const spacesCount = computed(() => spaceStore.spaces.length);
const tasksCount = computed(() => taskStore.tasks.length);
const completedTasks = computed(
  () => taskStore.tasks.filter((t) => t.status === "completed").length
);

const project = computed(() => projectStore.currentProject);

const progressPercentage = computed(() => {
  if (tasksCount.value === 0) return 0;
  return Math.round((completedTasks.value / tasksCount.value) * 100);
});

const handleEdit = async (data: CreateProject) => {
  await projectStore.updateProject(projectId, data);

  editModal.close();
};

const handleDelete = async () => {
  const success = await projectStore.deleteProject(projectId);

  if (success) {
    router.push("/");
  }
  deleteModal.close();
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
            @click="editModal.open()"
          >
            Editar
          </BaseButton>
          <BaseButton size="small" variant="danger" @click="deleteModal.open()">
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
          :subtitle="`${progressPercentage}% completado`"
        />
      </div>
      <BaseModal
        :is-open="editModal.isOpen.value"
        title="Editar Proyecto"
        @close="editModal.close()"
      >
        <ProjectForm
          :project="project"
          @cancel="editModal.close()"
          @submit="handleEdit"
        />
      </BaseModal>

      <BaseModal
        :is-open="deleteModal.isOpen.value"
        title="Eliminar Proyecto"
        size="small"
        @close="deleteModal.close()"
      >
        <div class="p-4">
          <p class="mb-4">
            ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no
            se puede deshacer.
          </p>
          <div class="flex justify-end gap-2">
            <BaseButton variant="secondary" @click="deleteModal.close()">
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
