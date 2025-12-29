<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useSpacesStore } from "@/stores/spaceStorage";
import { useTaskStore } from "@/stores/taskStore";
import SpaceCard from "@/components/features/spaces/SpaceCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import SpaceForm from "@/components/features/spaces/SpaceForm.vue";
import type { CreateSpace } from "@/types/database";

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const spaceStore = useSpacesStore();
const taskStore = useTaskStore();

const projectId = route.params.id as string;

const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedSpaceId = ref<string | null>(null);

onMounted(async () => {
  await Promise.all([
    projectStore.fetchProjectById(projectId),
    spaceStore.fetchSpacesByProject(projectId),
  ]);
});

const project = computed(() => projectStore.currentProject);
const selectedSpace = computed(() =>
  spaceStore.spaces.find((space) => space.id === selectedSpaceId.value)
);

const handleCreate = async (data: CreateSpace) => {
  await spaceStore.createSpace(data);
  isCreateModalOpen.value = false;
};

const handleEdit = async (data: CreateSpace) => {
  if (!selectedSpaceId.value) return;
  await spaceStore.updateSpace(selectedSpaceId.value, data);
  isEditModalOpen.value = false;
  selectedSpaceId.value = null;
};

const handleDelete = async () => {
  if (!selectedSpaceId.value) return;
  await spaceStore.deleteSpace(selectedSpaceId.value);
  isDeleteModalOpen.value = false;
  selectedSpaceId.value = null;
};

const openEditModal = (id: string) => {
  selectedSpaceId.value = id;
  isEditModalOpen.value = true;
};

const openDeleteModal = (id: string) => {
  selectedSpaceId.value = id;
  isDeleteModalOpen.value = true;
};

const handleViewTasks = (id: string) => {
  router.push(`/project/${projectId}/spaces/${id}/tasks`);
};

const getSpaceTasksCount = (id: string) => {
  return taskStore.tasks.filter((task) => task.space_id === id).length;
};

const getSpaceCompleteTasksCount = (id: string) => {
  return taskStore.tasks.filter(
    (task) => task.space_id === id && task.status === "completed"
  ).length;
};
</script>

<template>
  <div class="p-8">
    <!-- 1. Header -->
    <div class="mb-8">
      <BaseButton
        variant="ghost"
        size="small"
        @click="router.back()"
        class="mb-4"
      >
        ← Volver
      </BaseButton>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">
            Espacios de {{ project?.name || "Cargando..." }}
          </h1>
          <p v-if="project?.description" class="text-slate-600 mt-1">
            {{ project.description }}
          </p>
        </div>

        <BaseButton @click="isCreateModalOpen = true" variant="primary">
          + Nuevo Espacio
        </BaseButton>
      </div>
    </div>
    <!-- 2. Estados (Loading / Vacío / Contenido) -->
    <!-- Loading -->
    <div v-if="spaceStore.loading" class="text-slate-600">
      Cargando espacios...
    </div>

    <!-- Lista vacía -->
    <div v-else-if="spaceStore.spaces.length === 0" class="text-center py-12">
      <p class="text-slate-600 mb-4">No hay espacios todavía</p>
      <BaseButton @click="isCreateModalOpen = true" variant="primary">
        Crear primer espacio
      </BaseButton>
    </div>

    <!-- Grid de espacios -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SpaceCard
        v-for="space in spaceStore.spaces"
        :key="space.id"
        :space="space"
        :tasks-count="getSpaceTasksCount(space.id)"
        :completed-tasks="getSpaceCompleteTasksCount(space.id)"
        @view="handleViewTasks"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </div>
    <!-- 3. Modales -->
    <!-- Modal Crear Espacio -->
    <BaseModal
      :is-open="isCreateModalOpen"
      title="Nuevo Espacio"
      @close="isCreateModalOpen = false"
    >
      <SpaceForm
        :project-id="projectId"
        @submit="handleCreate"
        @cancel="isCreateModalOpen = false"
      />
    </BaseModal>

    <!-- Modal Editar Espacio -->
    <BaseModal
      :is-open="isEditModalOpen"
      title="Editar Espacio"
      @close="isEditModalOpen = false"
    >
      <SpaceForm
        v-if="selectedSpace"
        :space="selectedSpace"
        :project-id="projectId"
        @submit="handleEdit"
        @cancel="isEditModalOpen = false"
      />
    </BaseModal>

    <!-- Modal Eliminar Espacio -->
    <BaseModal
      :is-open="isDeleteModalOpen"
      title="Eliminar Espacio"
      size="small"
      @close="isDeleteModalOpen = false"
    >
      <div class="p-4">
        <p class="mb-4 text-slate-600">
          ¿Estás seguro de que deseas eliminar
          <strong>{{ selectedSpace?.name }}</strong
          >? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-2">
          <BaseButton variant="secondary" @click="isDeleteModalOpen = false">
            Cancelar
          </BaseButton>
          <BaseButton variant="danger" @click="handleDelete">
            Eliminar
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
